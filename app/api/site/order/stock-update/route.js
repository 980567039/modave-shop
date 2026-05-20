// 更新订单库存
import connectDB from "@/lib/db";
import Product from "@/models/product/Product";
import { NextResponse } from "next/server";

// Validation utilities
const validateProductData = (data) => {
  if (!data?.items?.length) {
    throw new Error('No items provided in the request');
  }
  
  // Validate each item has required fields
  data.items.forEach(item => {
    if (!item.productId || !item.quantity) {
      throw new Error('Invalid item data: productId and quantity are required');
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      throw new Error('Invalid quantity value');
    }
  });
};

// Safely convert to number
const toNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Stock update utilities
const prepareStockUpdates = (items, dbProducts) => {
  const updates = [];
  const errors = [];

  items.forEach(item => {
    const dbProduct = dbProducts.find(p => p._id.toString() === item.productId);
    
    if (!dbProduct) {
      errors.push(`Product not found: ${item.productId}`);
      return;
    }

    const currentStock = toNumber(dbProduct.stock);
    const quantityToReduce = toNumber(item.quantity);
    const newStock = currentStock - quantityToReduce;

    if (newStock < 0) {
      errors.push(`Insufficient stock for product: ${item.productId}`);
      return;
    }

    // Main product update - using explicit number conversion
    updates.push({
      updateOne: {
        filter: { _id: item.productId },
        update: {
          $set: {
            inStock: newStock > 0,
            stock: newStock,
          }
        }
      }
    });

    // Attribute-specific update if needed
    if (item.color || item.size) {
      const attributeQuery = {};
      if (item.size) attributeQuery['attributes.attributes.size.value'] = item.size;
      if (item.color) attributeQuery['attributes.attributes.color.value'] = item.color;

      // Find the specific attribute to get its current stock
      const attribute = dbProduct.attributes?.find(attr => {
        const sizeMatch = !item.size || attr.attributes.size?.value === item.size;
        const colorMatch = !item.color || attr.attributes.color?.value === item.color;
        return sizeMatch && colorMatch;
      });

      if (!attribute) {
        errors.push(`Attribute combination not found for product: ${item.productId}`);
        return;
      }

      const currentAttrStock = toNumber(attribute.stock);
      const newAttrStock = currentAttrStock - quantityToReduce;

      if (newAttrStock < 0) {
        errors.push(`Insufficient attribute stock for product: ${item.productId}`);
        return;
      }

      // Update attribute stock with explicit number value
      updates.push({
        updateOne: {
          filter: { 
            _id: item.productId,
            ...attributeQuery
          },
          update: {
            $set: {
              'attributes.$.stock': newAttrStock
            }
          }
        }
      });
    }
  });

  return { updates, errors };
};

export async function POST(req) {
  let session = null;
  
  try {
    const data = await req.json();
    validateProductData(data);
    
    const db = await connectDB();
    session = await db.startSession();
    
    // Start transaction
    await session.startTransaction();

    // Fetch all products in one query
    const productIds = data.items.map(item => item.productId);
    const dbProducts = await Product.find(
      { _id: { $in: productIds } },
      null,
      { session }
    );

    // Prepare updates and check for errors
    const { updates, errors } = prepareStockUpdates(data.items, dbProducts);
    
    if (errors.length) {
      throw new Error(JSON.stringify(errors));
    }

    // Perform all updates in a single bulk operation
    if (updates.length) {
      await Product.bulkWrite(updates, { session });
    }

    // Commit the transaction
    await session.commitTransaction();
    
    return NextResponse.json({
      success: true,
      message: "Order stock successfully updated"
    }, { status: 200 });

  } catch (error) {
    // Only abort if session exists and transaction is in progress
    if (session && session.inTransaction()) {
      await session.abortTransaction();
    }
    
    console.error("Stock update error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "Failed to update stock",
    }, { status: 400 });

  } finally {
    // Always end the session if it exists
    if (session) {
      await session.endSession();
    }
  }
}