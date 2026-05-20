// 获取 API 文档数据
import { NextResponse } from 'next/server';
import { scanApiRoutes } from '@/lib/api-scanner';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const routes = scanApiRoutes();
        return NextResponse.json({
            success: true,
            data: routes
        });
    } catch (error) {
        console.error('Error scanning API routes:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to scan API routes'
        }, { status: 500 });
    }
}
