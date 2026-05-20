import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb://127.0.0.1/nuvie";
const DB_NAME = "nuvie";

const CLOUDINARY_REGEX =
  /https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?!f_auto,q_auto)([^/]+\/v\d+\/.+)/i;

function addTransform(url) {
  // 如果已经包含 f_auto/q_auto，跳过
  if (url.includes("f_auto") || url.includes("q_auto")) return url;

  return url.replace(
    /image\/upload\//,
    "image/upload/f_auto,q_auto/"
  );
}

async function scanAndUpdate() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  const collections = await db.listCollections().toArray();
  console.log(`✅ 共发现 ${collections.length} 个 collection\n`);

  for (const { name } of collections) {
    const col = db.collection(name);
    console.log(`📌 扫描集合：${name}`);

    const docs = await col.find({}).toArray();

    let updatedCount = 0;

    for (const doc of docs) {
      const updates = {};
      
      function walk(obj, path) {
        for (const key in obj) {
          const value = obj[key];
          const newPath = path ? `${path}.${key}` : key;

          if (typeof value === "string" && value.includes("res.cloudinary.com")) {
            const newUrl = addTransform(value);
            if (newUrl !== value) {
              updates[newPath] = newUrl;
            }
          }

          if (typeof value === "object" && value !== null) {
            walk(value, newPath);
          }
        }
      }

      walk(doc, "");

      if (Object.keys(updates).length > 0) {
        await col.updateOne({ _id: doc._id }, { $set: updates });
        updatedCount++;
      }
    }

    console.log(`✅ 更新字段数: ${updatedCount}\n`);
  }

  await client.close();
  console.log("🎉 所有 Cloudinary URL 已成功加入 f_auto,q_auto");
}

scanAndUpdate().catch((err) => console.error(err));