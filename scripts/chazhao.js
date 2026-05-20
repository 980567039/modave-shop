import { MongoClient } from 'mongodb';

const MONGO_URI = 'mongodb://127.0.0.1/nuvie';
const DB_NAME = 'nuvie';
const SEARCH_STRING = 'res.cloudinary.com';

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const collections = await db.listCollections().toArray();
  console.log(`🔍 开始扫描 ${collections.length} 个集合...\n`);

  const tablesToUpdate = [];

  for (const colInfo of collections) {
    const collectionName = colInfo.name;
    const collection = db.collection(collectionName);

    const docs = await collection.find({}).limit(100).toArray(); // 可根据数据量调整 limit
    const fieldSet = new Set();

    for (const doc of docs) {
      const matches = [];
      findCloudinaryUrls(doc, '', matches);

      matches.forEach(m => fieldSet.add(m.field));
    }

    if (fieldSet.size > 0) {
      tablesToUpdate.push({
        collection: collectionName,
        fields: Array.from(fieldSet),
      });
    }
  }

  await client.close();

  console.log('🎉 扫描完成，生成 TABLES_TO_UPDATE 数组如下：\n');
  console.log(JSON.stringify(tablesToUpdate, null, 2));
}

// 递归查找包含 Cloudinary URL 的字段
function findCloudinaryUrls(obj, prefix, matches) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const key in obj) {
      const value = obj[key];
      const path = prefix ? `${prefix}.${key}` : key;

      if (typeof value === 'string' && value.includes(SEARCH_STRING)) {
        matches.push({ field: path, value });
      } else if (typeof value === 'object') {
        findCloudinaryUrls(value, path, matches);
      }
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => findCloudinaryUrls(item, `${prefix}[${idx}]`, matches));
  }
}

main().catch((err) => console.error('程序出错:', err));