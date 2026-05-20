import { MongoClient } from 'mongodb';

// === 1️⃣ 数据库配置 ===
const MONGO_URI = 'mongodb://127.0.0.1/nuvie';
const DB_NAME = 'nuvie';
const COLLECTION_CATEGORIES = 'productcategories';
const COLLECTION_MEDIA = 'medialibraries';

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const categoryCol = db.collection(COLLECTION_CATEGORIES);
  const mediaCol = db.collection(COLLECTION_MEDIA);

  console.log('🚀 开始扫描 productcategories 表...\n');

  const categories = await categoryCol.find({}).toArray();
  console.log(`共找到 ${categories.length} 条分类记录。\n`);

  for (const category of categories) {
    const updates = {}; // 将要更新的字段
    const categoryId = category._id;

    // === 🧩 categoryImage.url ===
    if (category.categoryImage?.url) {
      const oldUrl = category.categoryImage.url;
      const match = await mediaCol.findOne({
        url: { $regex: oldUrl, $options: 'i' },
      });
      if (match && match.url !== oldUrl) {
        updates['categoryImage.url'] = match.url;
        console.log(`✅ ${category.name || categoryId} 更新 categoryImage.url`);
      }
    }

    // === 🧩 categoryFeaturedImage.url ===
    if (category.categoryFeaturedImage?.url) {
      const oldUrl = category.categoryFeaturedImage.url;
      const match = await mediaCol.findOne({
        url: { $regex: oldUrl, $options: 'i' },
      });
      if (match && match.url !== oldUrl) {
        updates['categoryFeaturedImage.url'] = match.url;
        console.log(`✅ ${category.name || categoryId} 更新 categoryFeaturedImage.url`);
      }
    }

    // === 🧩 ogImage ===
    if (category.ogImage) {
      const oldUrl = category.ogImage;
      const match = await mediaCol.findOne({
        url: { $regex: oldUrl, $options: 'i' },
      });
      if (match && match.url !== oldUrl) {
        updates['ogImage'] = match.url;
        console.log(`✅ ${category.name || categoryId} 更新 ogImage`);
      }
    }

    // === 🔧 如果有需要更新的字段，就执行更新 ===
    if (Object.keys(updates).length > 0) {
      await categoryCol.updateOne({ _id: categoryId }, { $set: updates });
      console.log(`📝 已更新 ${Object.keys(updates).length} 个字段。\n`);
    } else {
      console.log(`⚠️ ${category.name || categoryId} 无需更新。\n`);
    }
  }

  await client.close();
  console.log('🎉 所有分类图片链接已同步完成。');
}

// === 4️⃣ 执行 ===
main().catch((err) => {
  console.error('程序出错:', err);
});