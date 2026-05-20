// 文件上传接口,支持图片和视频上传到 Cloudinary 并保存到数据库
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import crypto from 'crypto'
import MediaLibrary from '@/models/MediaLibrary'
import connectDB from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'

// Cloudinary 配置
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// POST: 上传文件到 Cloudinary
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    const formData = await req.formData()
    const file = formData.get('file')
    const mediaType = formData.get('mediaType') || 'image'

    if (!session) {
      return NextResponse.json({ message: 'You must be logged in.' }, { status: 401 })
    }

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    await connectDB()

    // 文件类型验证
    const allowedTypes =
      mediaType === 'video'
        ? ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
        : ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

    const maxSize = mediaType === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: `Invalid file type for ${mediaType}` }, { status: 400 })
    }

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large (max: ${maxSize / 1024 / 1024}MB)` },
        { status: 400 }
      )
    }

    // 生成随机文件名
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin'
    const sanitizedExt = fileExt.replace(/[^a-z0-9]/gi, '')
    const filename = `${crypto.randomBytes(16).toString('hex')}.${sanitizedExt}`

    // 转换 File 为 Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 上传到 Cloudinary
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'uploads', // 👈 你的 Cloudinary 文件夹名
          resource_type: mediaType === 'video' ? 'video' : 'image',
          public_id: filename.replace(/\.[^/.]+$/, ''), // 去除扩展名
          overwrite: true,
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    const result = uploadResponse

    // 保存到数据库
    const media = await MediaLibrary.create({
      userId: session?.user?.id,
      type: mediaType,
      title: `${session?.user?.id}-${filename}`,
      alt: file.name || '',
      description: '',
      url: result.secure_url,
      access: [],
    })

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        data: {
          url: result.secure_url,
          media,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 })
  }
}

// GET: 获取媒体列表
export async function GET(req) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ message: 'You must be logged in.' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '20', 10)
    const mediaType = searchParams.get('type') || 'image'
    const skip = (page - 1) * limit

    const query = { userId: session?.user?.id, type: mediaType }

    const media = await MediaLibrary.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalMedia = await MediaLibrary.countDocuments(query)

    return NextResponse.json(
      {
        media,
        totalMedia,
        currentPage: page,
        totalPages: Math.ceil(totalMedia / limit),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Error fetching media' }, { status: 500 })
  }
}