import { NextResponse } from 'next/server';
import { writeFile, mkdir, chmod } from 'fs/promises';
import path, { join } from 'path';
import crypto from 'crypto';
import MediaLibrary from '@/models/MediaLibrary';
import connectDB from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// 配置网站主机名
const HOSTNAME = 'https://uptownsrilanka.com';

// 根据环境配置Bitnami特定的上传目录
// 生产环境使用服务器路径，开发环境使用本地路径
const BITNAMI_UPLOAD_DIR = process.env.SITE_ENV === "production" 
  ? '/var/www/uploads' 
  : path.join(process.cwd(), 'public', 'uploads');

// 根据环境配置URL前缀
// 用于构建文件的访问URL
const URL_PREFIX = process.env.SITE_ENV === "production" 
  ? '/uploads/'
  : '/uploads/';

export async function POST(req) {
    try {
        // 获取用户会话信息，验证用户身份
        const session = await getServerSession(authOptions);
        // 解析表单数据
        const formData = await req.formData();
        // 获取上传的文件
        const file = formData.get('file');
        // 获取用户ID（注：此处获取但未使用，实际使用的是session中的用户ID）
        const userId = formData.get('userId');
        // 获取媒体类型，默认为图片
        const mediaType = formData.get('mediaType') || 'image'; 

        // 连接数据库
        await connectDB();

        // 验证用户是否已登录
        if (!session) {
            return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
        }

        // 验证是否有文件上传
        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        // 创建上传目录（如果不存在）
        try {
            // 递归创建目录结构
            await mkdir(BITNAMI_UPLOAD_DIR, { recursive: true });
            // 设置目录权限为755（所有者读写执行，组和其他用户读执行）
            await chmod(BITNAMI_UPLOAD_DIR, 0o755);
        } catch (error) {
            console.error('Error creating upload directory:', error);
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // 根据媒体类型定义允许的文件类型
        // 视频允许mp4、webm、ogg和quicktime格式
        // 图片允许jpeg、png、gif和webp格式
        const allowedTypes = mediaType === 'video' 
            ? ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'] 
            : ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        
        // 根据媒体类型设置最大文件大小
        // 视频最大50MB，图片最大5MB
        const maxSize = mediaType === 'video' 
            ? 50 * 1024 * 1024 // 50MB for videos
            : 5 * 1024 * 1024;  // 5MB for images

        // 验证文件类型是否允许
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: `Invalid file type for ${mediaType}` },
                { status: 400 }
            );
        }

        // 验证文件大小是否超过限制
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: `File too large (max: ${maxSize / (1024 * 1024)}MB)` },
                { status: 400 }
            );
        }

        // 处理文件扩展名
        // 获取原始扩展名并转为小写
        const fileExt = file.name.split('.').pop().toLowerCase();
        // 清理扩展名，只保留字母和数字
        const sanitizedExt = fileExt.replace(/[^a-z0-9]/gi, '');
        // 生成随机文件名，防止文件名冲突
        const filename = `${crypto.randomBytes(16).toString('hex')}.${sanitizedExt}`;
        
        // 将文件转换为Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 构建完整的文件路径
        const filepath = join(BITNAMI_UPLOAD_DIR, filename);
        
        try {
            // 写入文件到服务器
            await writeFile(filepath, buffer);
            // 设置文件权限为664（所有者和组读写，其他用户只读）
            await chmod(filepath, 0o664);
        } catch (error) {
            console.error('Error writing file:', error);
            return NextResponse.json(
                { error: 'Error saving file' },
                { status: 500 }
            );
        }

        // 根据环境生成文件访问URL
        const fileUrl = process.env.SITE_ENV === "production"
            ? `${URL_PREFIX}${filename}`
            : `${URL_PREFIX}${filename}`;
            
        // 在数据库中创建媒体记录
        const media = await MediaLibrary.create({
            userId: session?.user?.id,  // 使用会话中的用户ID
            type: mediaType,            // 使用请求中指定的媒体类型
            title: `${session?.user?.id}-${filename}`,  // 标题格式：用户ID-文件名
            alt: filename || "",        // 替代文本使用文件名
            description: "",            // 描述为空
            url: fileUrl,               // 文件访问URL
            access: []                  // 访问权限为空数组
        });

        // 如果媒体记录创建成功，返回成功响应
        if (media) {            
            return NextResponse.json({
                message: "File uploaded successfully", 
                data: {
                    url: fileUrl,       // 返回文件URL
                    media: media,       // 返回媒体记录
                }
            }, { status: 200 });
        }

    } catch (error) {
        // 捕获并记录上传过程中的任何错误
        console.error('Error uploading file:', error);
        return NextResponse.json(
            { error: 'Error uploading file' },
            { status: 500 }
        );
    }
}

// GET端点，用于检索媒体文件，支持类型过滤
export async function GET(req) {
    try {
        // 连接数据库
        await connectDB();
        // 获取用户会话信息
        const session = await getServerSession(authOptions);

        // 验证用户是否已登录
        if (!session) {
            return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
        }

        // 解析URL查询参数
        const { searchParams } = new URL(req.url);
        // 获取分页参数，默认第1页
        const page = parseInt(searchParams.get('page')) || 1;
        // 获取每页限制，默认20条
        const limit = parseInt(searchParams.get('limit')) || 20;
        // 获取媒体类型过滤，默认为图片
        const mediaType = searchParams.get('type') || 'image';
        
        // 计算跳过的记录数，用于分页
        const skip = (page - 1) * limit;

        // 构建查询条件：按媒体类型和用户ID过滤
        const query = { 
            userId: session?.user?.id,
            type: mediaType
        };

        // 查询媒体库记录
        // 按创建时间倒序排列，应用分页
        const media = await MediaLibrary.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // 获取符合条件的媒体总数
        const totalMedia = await MediaLibrary.countDocuments(query);

        // 返回媒体列表和分页信息
        return NextResponse.json({
            media: media,               // 媒体记录列表
            totalMedia: totalMedia,     // 媒体总数
            currentPage: page,          // 当前页码
            totalPages: Math.ceil(totalMedia / limit)  // 总页数
        }, { status: 200 });

    } catch (error) {
        // 捕获并记录获取媒体过程中的任何错误
        console.error("Error fetching media:", error);
        return NextResponse.json({ error: "Error fetching media" }, { status: 500 });
    }
}