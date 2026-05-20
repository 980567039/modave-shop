import mongoose from 'mongoose';
import MediaLibrary from '../models/MediaLibrary.js';
import User from '../models/User.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';

// ========== 环境路径 ==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ========== 读取图片URL文件 ==========
function readImageUrls() {
  try {
    const filePath = join(__dirname, 'product-image-urls.txt');
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    
    // 清理URL格式（移除引号、逗号）
    return lines.map(line => line.replace(/[',]/g, '').trim());
  } catch (error) {
    console.error('❌ 读取图片URL文件失败:', error.message);
    return [];
  }
}

async function addImagesToMediaLibrary() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/nuvie');
    console.log('✅ 已连接到 MongoDB');

    // 查找管理员用户
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      throw new Error('请先创建管理员用户');
    }

    // 读取图片URL
    const imageUrls = readImageUrls();
    if (imageUrls.length === 0) {
      console.log('⚠️ 未读取到任何图片 URL，请检查 product-image-urls.txt');
      return;
    }

    console.log(`📄 从文件读取到 ${imageUrls.length} 个图片 URL`);

    // 查已有的 URL
    const existingMediaItems = await MediaLibrary.find({}, { url: 1 });
    const existingUrls = new Set(existingMediaItems.map(item => item.url));

    // 过滤出新图片
    const newMedia = imageUrls
      .filter(url => !existingUrls.has(url))
      .map((url, index) => {
        const fileName = path.basename(url);
        return {
          userId: adminUser._id,
          type: 'image',
          title: `Product Image ${index + 1}`,
          alt: fileName,
          description: `Product image ${index + 1}`,
          url,
          access: ['public'],
        };
      });

    if (newMedia.length === 0) {
      console.log('✅ 数据库中已存在所有图片，无需新增。');
    } else {
      await MediaLibrary.insertMany(newMedia);
      console.log(`🎉 成功添加 ${newMedia.length} 张新图片到媒体库。`);
    }

  } catch (error) {
    console.error('❌ 添加图片到媒体库时出错:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 已断开 MongoDB 连接');
  }
}

// 执行
addImagesToMediaLibrary();