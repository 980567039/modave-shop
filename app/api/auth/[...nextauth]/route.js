// NextAuth 认证处理器,处理用户登录、登出等认证相关操作
import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
