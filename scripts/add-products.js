import mongoose from 'mongoose';
import Product from '../models/product/Product.js';
import ProductCategory from '../models/product/category/ProductCategory.js';
import ProductMaterial from '../models/product/material/ProductMaterial.js';
import MediaLibrary from '../models/MediaLibrary.js';
import User from '../models/User.js';
// import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import productsData from './products-data.js';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 加载环境变量
// dotenv.config({ path: join(__dirname, '../.env.local') });

// 生成slug函数
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// 生成随机SKU
function generateSKU(prefix = 'NUV') {
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${randomPart}`;
}

async function addProducts() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/nuvie');
    console.log('已连接到MongoDB');

    // 获取管理员用户
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('请先创建管理员用户');
    }

    // 获取分类数据
    const categories = await ProductCategory.find({ delete: false });
    if (categories.length === 0) {
      throw new Error('请先初始化产品分类');
    }

    // 获取材质数据
    const materials = await ProductMaterial.find({ delete: false });
    if (materials.length === 0) {
      throw new Error('请先初始化产品材质');
    }

    // 获取媒体库数据
    const mediaItems = await MediaLibrary.find();
    if (mediaItems.length === 0) {
      throw new Error('请先上传一些图片到媒体库');
    }

    // 从外部数据转换为产品数据
    function convertExternalDataToProducts(externalData) {
      return externalData.map(item => {
        // 提取分类信息
        const categoryIds = item.category ? 
          item.category.map(cat => cat._id || cat.id || cat).filter(id => id) : 
          [];
        
        // 提取材质信息
        const materialId = item.material ? item.material._id || item.material.id || item.material : null;
        
        // 提取图片信息
        const defaultImageUrl = item.defaultImage ? item.defaultImage.url : null;
        const imageGalleryUrls = item.imageGallery ? 
          item.imageGallery.map(img => img.url).filter(url => url) : 
          [];

          // console.log(defaultImageUrl)
        
        // 🧩 修改这里：处理 attributes.image
        let attributes = item.attributes || [];
        attributes = attributes.map(attr => {
          if (attr.image) {
            return {
              ...attr,
              image: attr.image.trim(),
            };
          }
          return attr;
        });
        
        // 计算实际价格
        const price = parseFloat(item.price) || 0;
        const salePrice = parseFloat(item.salePrice) || 0;
        const actualPrice = salePrice > 0 ? salePrice : price;
        
        return {
          title: item.title || '',
          titleSlug: item.titleSlug || generateSlug(item.title || ''),
          description: item.description || item.title,
          price: price,
          salePrice: salePrice,
          actualPrice: actualPrice,
          modelInfo: item.modelInfo || '',
          stock: item.stock || '0',
          categoryIds: categoryIds,
          materialId: materialId,
          materialComposition: item.materialComposition || '',
          defaultImageUrl: defaultImageUrl,
          imageGalleryUrls: imageGalleryUrls,
          attributes: attributes,
          variantAttributes: item.attributes,
          sku: item.sku || generateSKU(),
          seoTitle: item.seoTitle || `${item.title} - Nuvie`,
          seoDescription: item.seoDescription || `${item.title}`,
          seoKeywords: item.seoKeywords || '',
          sizeChart: item.sizeChart || '',
          isGiftCard: item.isGiftCard || false,
          inStock: item.inStock !== undefined ? item.inStock : true
        };
      });
    }
      
    // 示例产品数据 - 您可以替换为您的外部数据
    const externalProductsData = productsData['data']['products'];
    // 转换外部数据为产品数据
    const products = convertExternalDataToProducts(externalProductsData);

    // 创建产品
    for (let i = 0; i < products.length; i++) {
      const product = products[i];

      // 查找默认图片
      let defaultImage = null;
      if (product.defaultImageUrl) {
        const defaultImageItem = await MediaLibrary.findOne({
          url: { $regex: product.defaultImageUrl, $options: "i" }
        });
        // console.log(defaultImageItem._id)
        if (defaultImageItem) {
          defaultImage = defaultImageItem._id;
        }
      }

      // ✅ 手动映射：旧数据库ID -> 新数据库ID
      const categoryIdMap = {
        "67e3d567bc41d70ba83f179a": "68bc327aa0481b172a3b4334",
        "67e4f61ebc41d70ba83f1f05": "68bc327aa0481b172a3b4316",
        "67e53d7ebc41d70ba83f26f9": "68bc327aa0481b172a3b4336",
        "67e55ab4bc41d70ba83f3032": "68bc327aa0481b172a3b4348",
        "67e59ca1bc41d70ba83f4828": "68bc327aa0481b172a3b432c",
        "67e7b9cfbc41d70ba83f78f4": "68bc327aa0481b172a3b4308",
        "67e91ab42907b8d267f68c58": "68bc327aa0481b172a3b432e",
        "67e55693bc41d70ba83f2dcf": "68bc327aa0481b172a3b4344",
        "67e5cd88bc41d70ba83f5cd8": "68bc327aa0481b172a3b4346",
        "67e26c62bc41d70ba83f129f": "68bc327aa0481b172a3b4320",
        "67e617fabc41d70ba83f6700": "68bc327aa0481b172a3b433e",
        "67e59513bc41d70ba83f436c": "68bc327aa0481b172a3b431e",
        "67e58cccbc41d70ba83f3f16": "68bc327aa0481b172a3b4324",
        "67e596f6bc41d70ba83f44cf": "68bc327aa0481b172a3b4314",
        "67e616f5bc41d70ba83f66ec": "68bc327aa0481b172a3b42fc",
        "67e61b55bc41d70ba83f68d1": "68bc327aa0481b172a3b433c",
        "67e53fefbc41d70ba83f27e8": "68bc327aa0481b172a3b42fe",
        "67e7a6cfbc41d70ba83f77ad": "68bc327aa0481b172a3b430a",
        "67c6bdbd6bb33366e5af47e8": "68bc327aa0481b172a3b42fa",
        "67e55387bc41d70ba83f2c53": "68bc327aa0481b172a3b4340",
        "67e7c9e3bc41d70ba83f7b2e": "68bc327aa0481b172a3b4342",
        "67e53171bc41d70ba83f255e": "68bc327aa0481b172a3b4330",
        "67e39ea3bc41d70ba83f166f": "68bc327aa0481b172a3b432a",
        "67e53e10bc41d70ba83f2732": "68bc327aa0481b172a3b42f8",
        "67e5658cbc41d70ba83f357b": "68bc327aa0481b172a3b4322",
        "67e5b381bc41d70ba83f53f7": "68bc327aa0481b172a3b4328",
        "67e61840bc41d70ba83f6709": "68bc327aa0481b172a3b433a",
        "67c6bdb66bb33366e5af47e4": "68bc327aa0481b172a3b4318",
        "67e3d53abc41d70ba83f1796": "68bc327aa0481b172a3b4332",
        "67e504f2bc41d70ba83f221a": "68bc327aa0481b172a3b431a",
        "67e58d5bbc41d70ba83f3f80": "68bc327aa0481b172a3b431c",
        "67f76293c4454e266d51d388": "68bc327aa0481b172a3b4300",
        "67f8d87b193d68ca02d8178d": "68bc327aa0481b172a3b4302",
        "684aa2fb2dee60c5f5e3cf19": "68bc327aa0481b172a3b430c",
        "684aa49e2dee60c5f5e3d177": "68bc327aa0481b172a3b430e",
        "684aae5b2dee60c5f5e3dda3": "68bc327aa0481b172a3b4310",
        "684d57a62dee60c5f5e7487c": "68bc327aa0481b172a3b4312",
        "684d87802dee60c5f5e7961b": "68bc327aa0481b172a3b4314",
        "6857dac816518e71a14f89b3": "68bc327aa0481b172a3b4304",
        "685a90ab16518e71a1532b8a": "68bc327aa0481b172a3b4306",
        "687a1fc01d8aec85b32a2a58": "68bc327aa0481b172a3b4338",
        "69071e4fd66d9ab860cf5091": "6909b268f7e20062c45483d6"
      };

      // ✅ 优先尝试ID映射
      const categoryIds = [];
      if (product.categoryIds && product.categoryIds.length > 0) {
        for (const categoryRef of product.categoryIds) {
          let categoryId = null;

          // 判断是 ObjectId 字符串
          if (typeof categoryRef === "string" && categoryIdMap[categoryRef]) {
            categoryId = categoryIdMap[categoryRef];
            console.log(`🔗 ID映射成功: ${categoryRef} -> ${categoryId}`);
            categoryIds.push(categoryId);
            continue;
          }

          // 否则走原来的按标题匹配逻辑
          const categoryTitle =
            typeof categoryRef === "string"
              ? categoryRef
              : categoryRef.title || categoryRef.name;

          if (categoryTitle) {
            const category = await ProductCategory.findOne({
              title: { $regex: new RegExp(`^${categoryTitle}$`, "i") },
              delete: false,
            });
            if (category) {
              categoryIds.push(category._id);
              console.log(`🧩 匹配分类成功: ${categoryTitle} -> ${category._id}`);
            } else {
              console.warn(`⚠️ 未找到分类: ${categoryTitle}`);
            }
          }
        }
}
      // 如果没找到分类，使用随机分类兜底
      if (categoryIds.length === 0) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        categoryIds.push(randomCategory._id);
        console.log(`⚙️ 使用随机分类: ${randomCategory.title}`);
      }

        // 查找材质
        let materialId = null;
        if (product.materialId) {
          const material = await ProductMaterial.findById(product.materialId);
          if (material) {
            materialId = material._id;
          }
        }

      // 没找到则随机选择一个
      if (!materialId) {
        const randomMaterial = materials[Math.floor(Math.random() * materials.length)];
        materialId = randomMaterial._id;
        console.log(`⚙️ 使用随机材质: ${randomMaterial.title}`);
      }

      // ✅ 查找图片库中 gallery 图片
      const imageGallery = [];
      if (product.imageGalleryUrls && product.imageGalleryUrls.length > 0) {
        for (const imgUrl of product.imageGalleryUrls) {
          const media = await MediaLibrary.findOne({ url: { $regex: imgUrl } });
          if (media) {
            imageGallery.push(media._id);
          }
        }
      }
      // ✅ 替换 attributes 中的 image 为媒体库 URL
      if (Array.isArray(product.attributes) && product.attributes.length > 0) {
        for (let j = 0; j < product.attributes.length; j++) {
          const attr = product.attributes[j];
          const imgPath = attr.image;

          if (imgPath) {
            const media = await MediaLibrary.findOne({
              url: { $regex: imgPath.replace(/\./g, "\\.") }
            });

            if (media && media.url) {
              console.log(`🧠 ${product.title} - 属性图片匹配成功: ${imgPath} → ${media.url}`);
              product.attributes[j].image = media.url;
            } else {
              console.warn(`⚠️ ${product.title} - 未找到匹配图片: ${imgPath}`);
            }
          }
        }
      }
      // // ✅ 创建产品
      await Product.create({
        title: product.title,
        titleSlug: product.titleSlug,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice,
        actualPrice: product.actualPrice,
        modelInfo: product.modelInfo,
        stock: product.stock,
        category: categoryIds,
        material: materialId,
        materialComposition: product.materialComposition,
        defaultImage: defaultImage,
        imageGallery: imageGallery,
        attributes: product.attributes,
        sku: product.sku,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        seoKeywords: product.seoKeywords,
        ogTitle: product.seoTitle,
        ogDescription: product.seoDescription,
        sizeChart: product.sizeChart,
        visibility: true,
        isGiftCard: product.isGiftCard,
        showInShopPage: true,
        inStock: product.inStock,
        delete: false,
        createdBy: adminUser._id,
        variantAttributes: product.variantAttributes,
      });

      console.log(`✅ 创建产品: ${product.title} (${i + 1}/${products.length})`);
    }

    console.log('产品初始化完成');

  } catch (error) {
    console.error('产品初始化错误:', error);
  } finally {
    await mongoose.disconnect();
    console.log('已断开MongoDB连接');
  }
}

addProducts();