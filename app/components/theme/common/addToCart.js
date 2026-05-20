"use client";
import { SiteContext } from '@/app/contexts/siteContexts';
import { Button } from '@/components/ui/button';
import { apiReq } from '@/lib/common';
// import { trackAddToCart } from '@/lib/facebook-conversion-api';
import { Loader2, ShoppingCart } from 'lucide-react';
import React, { useContext, useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

export default function AddToCart({ product, quantity, classes, availableStock }) {
  const { cart, setCart, uniqueID, browserInfo, ipAddress, setOpenCartModal } = useContext(SiteContext);
  const [isLoading, setIsLoading] = useState(false);


  const handlerAddToCart = async () => {
    let cartItem;
    const existingItem = cart.find(cartItem =>
      cartItem.productId === product._id &&
      (product.selectedColor ? cartItem.color === product.selectedColor : true) &&
      (product.selectedSize ? cartItem.size === product.selectedSize : true)
    );

    if (existingItem) {
      const updatedCart = cart.map(cartItem =>
        cartItem.productId === product._id &&
          (product.selectedColor ? cartItem.color === product.selectedColor : true) &&
          (product.selectedSize ? cartItem.size === product.selectedSize : true)
          ? { ...cartItem, quantity }
          : cartItem
      );
      cartItem = updatedCart;
    } else {
      const updatedCart = [...cart, {
        productId: product._id,
        name: product.title,
        slug: product.titleSlug,
        price: product.price,
        salePrice: product.salePrice,
        image: product.mainImage,
        quantity: quantity || 1,
        size: product.selectedSize,
        color: product.selectedColor,
        stock: Number(product?.availableStock || product.stock),
        sku: product?.sku || '',
        randomKey: uuidv4(),
        isGiftCard: product?.isGiftCard || false
      }];
      cartItem = updatedCart;
    }

    if (cartItem && cartItem.length > 0) {
      try {
        setIsLoading(true);
        const url = 'site/cart';
        const res = await apiReq(url, 'POST', {
          uniqueID,
          cart: cartItem,
          ip: ipAddress || '',
          browser: browserInfo || ''
        });

        if (res && res.status === 200) {
          const { data } = await res.json();
          setCart(data.cart);

          // Track the Add to Cart event
          // await trackAddToCart({
          //   productId: product._id,
          //   value: product.salesPrice || product.price,
          //   currency: 'LKR',
          //   user: {}, 
          //   quantity
          // });

          toast.success("Item added to cart", {
            description: `${product?.title} is added to cart`
          });

          setOpenCartModal(true);
        } else {
          console.log("Failed to save cart data:", res.statusText);
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error saving cart data:', error);
        toast.error("Something went wrong!", {
          description: `please try again later`
        })
        setIsLoading(false)
      }
    }
  };

  return (
    <Button className={`rounded-full text-xs uppercase font-headingFontMedium ${classes ? classes : ''}`} onClick={handlerAddToCart} disabled={isLoading}>
      Add To Cart
      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className='w-5 h-5' size={8}/>}
    </Button>
  );
}
