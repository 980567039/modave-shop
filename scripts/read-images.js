
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { MongoClient } from 'mongodb';

// === 1️⃣ 配置 ===
const MONGO_URI = 'mongodb://127.0.0.1/nuvie';
const DB_NAME = 'nuvie';
const COLLECTION = 'medialibraries';
const UPLOAD_DIR = '/Users/ling/Desktop/nuvie/public/uploads1';

cloudinary.config({
    cloud_name: 'da9eiiz5f', // 例如 'mycloud'
    api_key: 635288419719877,
    api_secret:  'K3djA93bT0KRYC757vEJ1E-fRZk',
  });

const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];

// === 2️⃣ 工具函数 ===
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
        overwrite: false,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
}

// === 3️⃣ 主逻辑 ===
async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION);

  const imageFiles = getAllImageFiles(UPLOAD_DIR);
  console.log(`🖼️ 共找到 ${imageFiles.length} 张图片，开始上传并更新数据库...\n`);

  for (const filePath of imageFiles) {
    const filename = path.basename(filePath);
    try {
      const res = await uploadToCloudinary(filePath);
      console.log(`✅ 上传成功: ${res.public_id}`);
      console.log(`   URL: ${res.secure_url}`);

      // === 🔍 在 MongoDB 中查找包含 public_id 的文档并更新 url 字段 ===
      const query = { url: { $regex: res.public_id, $options: 'i' } };
      const update = { $set: { url: res.secure_url } };

      const result = await collection.updateMany(query, update);

      if (result.modifiedCount > 0) {
        console.log(`📝 已更新 ${result.modifiedCount} 条记录。\n`);
      } else {
        console.log(`⚠️ 数据库中未找到匹配 ${res.public_id} 的记录。\n`);
      }
    } catch (err) {
      console.error(`❌ 处理失败: ${filename}`);
      console.error(err.message, '\n');
    }
  }

  await client.close();
  console.log('🎉 所有上传与数据库更新任务完成。');
}

// === 4️⃣ 执行 ===
main().catch((err) => {
  console.error('程序出错:', err);
});