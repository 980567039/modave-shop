import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';

// === 配置 ===
const MONGO_URI = 'mongodb://127.0.0.1/nuvie';
const DB_NAME = 'nuvie';
const UPLOAD_DIR = '/Users/ling/Desktop/nuvie/public/uploads';

const TABLES_TO_UPDATE = [
  { collection: 'medialibraries', fields: ['url'] },
  { collection: 'productcategories', fields: ['categoryImage.url', 'categoryFeaturedImage.url', 'ogImage'] },
  { collection: 'storethemes', fields: [
    'common.mainLogo',
    'common.commonInnerBanner',
    'common.sizeCharts[].image',
    'common.sizeCharts[].mobileImage',
    'header.slider[].image',
    'header.slider[].mobileImage',
    'header.selectedProducts[].defaultImage.url',
    'mainNavigation[].imageUrl',
    'mainNavigation[].subMenus[].imageUrl',
    'highlightedCategories[].image',
    'selectedFeaturedCategories[].categoryImage.url',
    'selectedFeaturedCategories[].categoryFeaturedImage.url',
    'trending.leftImage',
    'trending.selectedProducts[].defaultImage.url',
    'footer.highlightedCard[].icon',
    'footer.leftContent.footerLogo'
  ] },
  { collection: 'carts', fields: ['cart[].image'] },
  { collection: 'orders', fields: ['items[].image'] },
  { collection: 'products', fields: ['attributes[].image'] }
];

cloudinary.config({
  cloud_name: 'da9eiiz5f',
  api_key: 635288419719877,
  api_secret: 'K3djA93bT0KRYC757vEJ1E-fRZk',
});

const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

// === 工具函数 ===
function getAllImageFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      results = results.concat(getAllImageFiles(filePath));
    } else if (validExtensions.includes(path.extname(file).toLowerCase())) {
      results.push(filePath);
    }
  }
  return results;
}

async function uploadToCloudinary(filePath) {
  const filename = path.basename(filePath);
  const buffer = fs.readFileSync(filePath);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'uploads',
        resource_type: 'image',
        public_id: filename.replace(/\.[^/.]+$/, ''),
        overwrite: true,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

// === 主逻辑 ===
async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const imageFiles = getAllImageFiles(UPLOAD_DIR);
  console.log(`🖼️ 共找到 ${imageFiles.length} 张图片，开始上传并更新数据库...\n`);

  let uploadedCount = 0;

  for (const filePath of imageFiles) {
    const filename = path.basename(filePath);
    const publicId = filename.replace(/\.[^/.]+$/, '');
    try {
      const res = await uploadToCloudinary(filePath);
      uploadedCount++;
      console.log(`✅ [${uploadedCount}/${imageFiles.length}] 上传成功: ${res.public_id}`);
      console.log(`   URL: ${res.secure_url}`);

      // 遍历所有表和字段进行更新
      for (const table of TABLES_TO_UPDATE) {
        const collection = db.collection(table.collection);
        const docs = await collection.find({}).toArray();

        for (const doc of docs) {
          let modified = false;

          for (const fieldPath of table.fields) {
            const updated = updateNestedField(doc, fieldPath, publicId, res.secure_url);
            if (updated) modified = true;
          }

          if (modified) {
            await collection.replaceOne({ _id: doc._id }, doc);
            console.log(`♻️ ${table.collection} 文档 _id=${doc._id} 已更新`);
          }
        }
      }

      console.log('');

    } catch (err) {
      console.error(`❌ 处理失败: ${filename}`);
      console.error(err.message, '\n');
    }
  }

  await client.close();
  console.log('🎉 所有上传与数据库更新任务完成。');
}

// === 递归更新字段，支持数组和嵌套对象 ===
function updateNestedField(obj, fieldPath, publicId, newUrl) {
  const parts = fieldPath.split('.');
  return traverse(obj, parts, 0, publicId, newUrl, fieldPath);
}

function traverse(obj, parts, index, publicId, newUrl, fullPath) {
  if (!obj) return false;
  const key = parts[index];

  // 处理数组
  if (key.endsWith('[]')) {
    const arrKey = key.slice(0, -2);
    const arr = obj[arrKey];
    if (!Array.isArray(arr)) return false;
    let changed = false;
    for (const item of arr) {
      if (traverse(item, parts, index + 1, publicId, newUrl, fullPath)) changed = true;
    }
    return changed;
  }

  if (index === parts.length - 1) {
    const val = obj[key];
    if (typeof val === 'string') {
      const oldFileName = path.basename(val).split('.')[0];
      if (oldFileName === publicId) {
        obj[key] = newUrl;
        console.log(`   🔹 更新字段: ${fullPath}, 原值: ${val}`);
        return true;
      }
    }
    return false;
  }

  return traverse(obj[key], parts, index + 1, publicId, newUrl, fullPath);
}

main().catch(err => console.error('程序出错:', err));