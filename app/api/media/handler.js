import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/db';
import ActivityLogs from '@/models/ActivityLogs';
import MediaLibrary from '@/models/MediaLibrary';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';


// 生成随机文件名函数，用于S3存储时防止文件名冲突
const generateFileName = (bytes = 32) => {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    return [...array].map(b => b.toString(16).padStart(2, "0")).join("");
};

// 初始化S3客户端，用于与AWS S3存储服务通信
const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// 定义允许上传的文件类型列表
const acceptTypes = [
    "image/jpg",
    "image/png",
    "image/webp",
    "image/jpeg",
];

// 定义最大文件大小限制：2MB
const maxFileSize = 1020 * 1024 * 2 // 2mb


// 处理POST请求的函数 - 用于上传媒体文件
async function handlePost(req) {
    // 获取用户会话信息，验证用户是否已登录
    const session = await getServerSession(authOptions);
    // 从请求体中解析文件信息
    const { file, type, size, checksum } = await req.json();

    // 连接数据库
    await connectDB();

    // 验证用户是否已登录
    if (!session) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
    }

    // 验证文件类型是否在允许列表中
    if (!acceptTypes.includes(type)) {
        return NextResponse.json({ message: "Invalid file type. Please upload a file in one of the supported formats (e.g., JPEG, PNG)." }, { status: 500 });
    }
    // 验证文件大小是否超过限制
    if (size > maxFileSize) {
        return NextResponse.json({ message: "File too large. We recommend a file size of less than 2MB." }, { status: 500 });
    }

    // 创建S3上传命令对象
    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,  // S3存储桶名称
        Key: generateFileName(),         // 生成随机文件名
        ContentType: type,               // 文件类型
        ContentLength: size,             // 文件大小
        ChecksumSHA256: checksum,        // 文件校验和
        Metadata: {
            userId: session?.user?.id    // 添加用户ID作为元数据
        }
    });

    try {
        // 获取S3预签名URL，用于前端直接上传文件到S3
        const url = await getSignedUrl(
            s3Client,
            putObjectCommand,
            { expiresIn: 60 } // URL有效期60秒
        );

        if (url) {
            // 在数据库中创建媒体记录
            const media = await MediaLibrary.create({
                userId: session?.user?.id,
                // 根据文件类型判断是图片还是视频
                type: type && type.startsWith("image") ? "image" : "video",
                // 使用用户ID和时间戳创建标题
                title: `${session?.user?.id}-${Math.floor(Date.now() / 1000)}`,
                alt: file.name || "",
                description: "",
                // 存储不带查询参数的URL，这是S3中文件的永久URL
                url: url.split("?")[0],
                access: []
            });

            // 返回成功响应，包含预签名URL和媒体记录
            return NextResponse.json({
                message: "Success", data: {
                    url,
                    media,
                }
            }, { status: 200 });
        } else {
            return NextResponse.json({ error: "URL not found in S3" }, { status: 500 });
        }


        // 添加活动日志记录（当前被注释）:
        // await ActivityLogs.create({
        //     userId: session?.user?.id,
        //     businessId: user?.business.id,
        //     activityType: "Add Media",
        //     activityDetails: `Add new ${type && type.startsWith("image") ? "image" : "video"} to the media`,
        //     endpoint: req.url || '',
        //     method: "POST",
        // });

    } catch (error) {
        // 捕获并返回错误信息
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// 处理PUT请求的函数 - 用于更新媒体信息（当前为占位实现）
async function handlePut(req) {
    // 验证用户会话
    const session = await getServerSession();
    const reqData = await req.json();

    if (!session) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
    }

    try {
        // PUT逻辑占位（待实现）
        return NextResponse.json({ message: "PUT request success", data: reqData }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process PUT request', message: error.message }, { status: 500 });
    }
}

// 处理DELETE请求的函数 - 用于删除媒体（当前为占位实现）
async function handleDelete(req) {
    // 验证用户会话
    const session = await getServerSession();

    if (!session) {
        return NextResponse.json({ message: "You must be logged in." }, { status: 401 });
    }

    try {
        // DELETE逻辑占位（待实现）
        return NextResponse.json({ message: "DELETE request success" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to process DELETE request', message: error.message }, { status: 500 });
    }
}

// 处理GET请求的函数 - 用于获取媒体列表，支持分页
async function handleGet(req) {
    // 验证用户会话
    const session = await getServerSession(authOptions);
    // 解析URL参数
    const url = new URL(req.url);
    // 获取分页参数，默认第1页，每页16条
    const page = parseInt(url.searchParams.get('page')) || 1;
    const limit = parseInt(url.searchParams.get('limit')) || 16;

    if (session) {
        
        try {
            // 计算跳过的记录数，用于分页
            const skip = (page - 1) * limit;

            // 查询媒体库记录，按创建时间倒序排列
            const media = await MediaLibrary.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            // 获取媒体总数，用于计算总页数
            const totalCount = await MediaLibrary.countDocuments();

            // 返回媒体列表和分页信息
            return NextResponse.json({
                message: "GET request success",
                media,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                hasMore: skip + media.length < totalCount  // 判断是否还有更多记录
            }, { status: 200 });

        } catch (error) {
            return NextResponse.json({ error: 'Failed to process GET request', message: error.message }, { status: 500 });
        }
    } else {
        return NextResponse.json({ error: 'Session not found' }, { status: 400 });
    }
}

// 导出处理各种HTTP请求的函数
export { handlePost, handlePut, handleDelete, handleGet };
