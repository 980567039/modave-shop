import { MongoClient } from "mongodb";

// === 1️⃣ 配置 ===
const MONGO_URI = "mongodb://127.0.0.1/nuvie";
const DB_NAME = "nuvie";
const COLLECTION_THEMES = "storethemes";
const COLLECTION_MEDIA = "medialibraries";

async function main() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const themesCol = db.collection(COLLECTION_THEMES);
  const mediaCol = db.collection(COLLECTION_MEDIA);

  console.log("🚀 开始扫描 storethemes 表...\n");

  const themes = await themesCol.find({}).toArray();
  console.log(`共找到 ${themes.length} 条 storethemes 记录。\n`);

  for (const theme of themes) {
    const themeId = theme._id;
    const updates = {};

    // === 🧩 1️⃣ common.sizeCharts 数组 ===
    if (Array.isArray(theme.common?.sizeCharts)) {
      const updatedCharts = await Promise.all(
        theme.common.sizeCharts.map(async (chart) => {
          const newChart = { ...chart };

          // image
          if (chart.image) {
            const match = await mediaCol.findOne({
              url: { $regex: chart.image, $options: "i" },
            });
            if (match && match.url !== chart.image) {
              newChart.image = match.url;
              console.log(`✅ 更新 sizeCharts.image -> ${match.url}`);
            }
          }

          // mobileImage
          if (chart.mobileImage) {
            const match = await mediaCol.findOne({
              url: { $regex: chart.mobileImage, $options: "i" },
            });
            if (match && match.url !== chart.mobileImage) {
              newChart.mobileImage = match.url;
              console.log(`✅ 更新 sizeCharts.mobileImage -> ${match.url}`);
            }
          }

          return newChart;
        })
      );

      updates["common.sizeCharts"] = updatedCharts;
    }

    // === 🧩 2️⃣ mainNavigation 数组 ===
    if (Array.isArray(theme.mainNavigation)) {
      const updatedNav = await Promise.all(
        theme.mainNavigation.map(async (nav) => {
          const newNav = { ...nav };

          // imageUrl
          if (nav.imageUrl) {
            const match = await mediaCol.findOne({
              url: { $regex: nav.imageUrl, $options: "i" },
            });
            if (match && match.url !== nav.imageUrl) {
              newNav.imageUrl = match.url;
              console.log(`✅ 更新 mainNavigation.imageUrl -> ${match.url}`);
            }
          }

          // subMenus 数组
          if (Array.isArray(nav.subMenus)) {
            newNav.subMenus = await Promise.all(
              nav.subMenus.map(async (sub) => {
                const newSub = { ...sub };
                if (sub.imageUrl) {
                  const match = await mediaCol.findOne({
                    url: { $regex: sub.imageUrl, $options: "i" },
                  });
                  if (match && match.url !== sub.imageUrl) {
                    newSub.imageUrl = match.url;
                    console.log(`✅ 更新 subMenus.imageUrl -> ${match.url}`);
                  }
                }
                return newSub;
              })
            );
          }

          return newNav;
        })
      );

      updates["mainNavigation"] = updatedNav;
    }

    // === 🔧 如果有更新，写入数据库 ===
    if (Object.keys(updates).length > 0) {
      await themesCol.updateOne({ _id: themeId }, { $set: updates });
      console.log(`📝 已更新 storetheme ${themeId}。\n`);
    } else {
      console.log(`⚠️ ${themeId} 无需更新。\n`);
    }
  }

  await client.close();
  console.log("🎉 所有 storethemes 图片链接同步完成。");
}

// === 执行 ===
main().catch((err) => {
  console.error("程序出错:", err);
});