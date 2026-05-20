"use server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const generateFileName = (bytes = 32) => {
    const array = new Uint8Array(bytes);
    crypto.getRandomValues(array);
    return [...array].map(b => b.toString(16).padStart(2, "0")).join("");
};


const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const acceptTypes = [
    "image/jpg",
    "image/png",
    "image/webp",
    "image/jpeg",
];

const maxFileSize = 1020 * 1024 * 2 // 2mb

export async function getSignedURL(type, size, checksum) {
    //   if (!session) {
    //     return { failure: "not authenticated" }
    //   }

    if (!acceptTypes.includes(type)) {
        return { failure: "Invalid file type" }
    }
    if (size > maxFileSize) {
        return { failure: "File too large" }
    }

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: generateFileName(),
        ContentType: type,
        ContentLength: size, 
        ChecksumSHA256: checksum,
        Metadata:{
            userId: ""
        }
    });

    const url = await getSignedUrl(
        s3Client,
        putObjectCommand,
        { expiresIn: 60 } // 60 seconds
    );

    const returnUrl = url.split("?")[0];

    return { success: { url: url } };
}
