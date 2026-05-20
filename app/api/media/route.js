// 媒体库管理接口,支持媒体文件的增删改查操作
import { handleDelete } from "./handler";
import { handleGet } from "./handler";
import { handlePut } from "./handler";
import { handlePost } from "./handler";

// Define individual handler functions for each HTTP method
export const POST = async (req, res) => {
    return await handlePost(req, res);
};

export const PUT = async (req, res) => {
    return await handlePut(req, res);
};

export const DELETE = async (req, res) => {
    return await handleDelete(req, res);
};

export const GET = async (req, res) => {
    return await handleGet(req, res);
};

// Handle unsupported methods (this part can be handled by your framework, if required)
export const unsupportedMethod = async (req, res) => {
    return res.status(405).end(`Method ${req.method} Not Allowed`);
};
