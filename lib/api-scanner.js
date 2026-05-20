import fs from 'fs';
import path from 'path';

const API_DIR = path.join(process.cwd(), 'app/api');

/**
 * 递归扫描目录获取 API 路由信息
 * @param {string} dir 当前扫描的目录
 * @param {string} baseUrl 当前目录对应的 URL 路径
 * @returns {Array} API 信息列表
 */
export function scanApiRoutes(dir = API_DIR, baseUrl = '/api') {
    let routes = [];

    if (!fs.existsSync(dir)) {
        return routes;
    }

    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            // 递归扫描子目录
            routes = routes.concat(scanApiRoutes(fullPath, `${baseUrl}/${item}`));
        } else if (item === 'route.js' || item === 'route.ts') {
            // 找到 API 路由文件
            const apiInfo = extractApiInfo(fullPath, baseUrl);
            if (apiInfo) {
                routes.push(apiInfo);
            }
        }
    }

    return routes;
}

/**
 * 从路由文件中提取 API 信息
 * @param {string} filePath 文件路径
 * @param {string} urlPath API URL 路径
 * @returns {Object|null} API 信息对象
 */
function extractApiInfo(filePath, urlPath) {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const methods = [];

        // 简单的正则匹配导出的方法
        // 匹配 export async function GET, export const GET, etc.
        // 同时也匹配 export { handleGet as GET } 这种形式

        const methodRegex = /export\s+(?:async\s+function|const)\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)/g;
        let match;
        while ((match = methodRegex.exec(content)) !== null) {
            methods.push(match[1]);
        }

        // 匹配 export { ... as GET }
        const aliasRegex = /export\s+\{\s*[^}]*\s+as\s+(GET|POST|PUT|DELETE|PATCH|HEAD|OPTIONS)\s*\}/g;
        while ((match = aliasRegex.exec(content)) !== null) {
            methods.push(match[1]);
        }

        if (methods.length === 0) {
            return null;
        }

        // 尝试提取 Query 参数 (仅针对 GET)
        const queryParams = new Set();
        if (methods.includes('GET')) {
            // 匹配 searchParams.get("key") 或 searchParams.get('key')
            const paramRegex = /searchParams\.get\(['"]([^'"]+)['"]\)/g;
            while ((match = paramRegex.exec(content)) !== null) {
                queryParams.add(match[1]);
            }
        }

        // 提取文件开头的注释作为描述
        let description = '';
        const lines = content.split('\n');
        const commentLines = [];

        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue; // 跳过空行

            if (trimmed.startsWith('//')) {
                let comment = trimmed.substring(2).trim();
                // 如果用户使用了 "api描述:" 前缀，去掉它
                if (comment.toLowerCase().startsWith('api描述:')) {
                    comment = comment.trim();
                }
                commentLines.push(comment);
            } else if (trimmed.startsWith('/*')) {
                // 简单的块注释处理，假设在开头
                // 这里只处理单行或多行的块注释，直到遇到 */
                // 为了简单起见，如果第一行不是 // 开头，我们暂时只处理 // 风格，或者简单的块注释
                // 如果用户习惯用 //，我们优先支持 //
                // 如果遇到非注释行（且不是 import），停止提取
                if (!trimmed.startsWith('import') && !trimmed.startsWith('export')) {
                    // 可能是块注释的开始
                }
                break;
            } else {
                // 遇到非注释行（如 import），停止提取
                break;
            }
        }

        if (commentLines.length > 0) {
            description = commentLines.join(' ');
        }

        return {
            path: urlPath,
            methods: [...new Set(methods)], // 去重
            queryParams: Array.from(queryParams),
            description: description,
            filePath: filePath // 仅供调试用，前端可能不需要
        };

    } catch (error) {
        console.error(`Error parsing ${filePath}:`, error);
        return null;
    }
}
