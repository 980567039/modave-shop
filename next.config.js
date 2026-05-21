const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.js');

const nextConfig = {
    eslint: {
        ignoreDuringBuilds: true, // ❌ 构建时忽略 ESLint
    },
    images: {
        unoptimized: process.env.NODE_ENV === 'development',
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.pexels.com',
            }, {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
            {
                protocol: 'https',
                hostname: 'dummyimage.com',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'scontent.cdninstagram.com',
            },
            {
                protocol: 'https',
                hostname: 'scontent.fcmb1-2.fna.fbcdn.net',
            },
            {
                protocol: 'https',
                hostname: 'googleapis.com',
            },
            {
                protocol: 'https',
                hostname: 'uptownsrilanka.com',
            },
            {
                protocol: 'https',
                hostname: 'nuvie001.shop',
            },
            {
                protocol: 'http',
                hostname: 'nuvie001.shop',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
            },
            {
                protocol: 'http',
                hostname: '192.168.1.141',
            },
            {
                protocol: 'https',
                hostname: 'modavenextjs.vercel.app',
            },
            {
                protocol: 'https',
                hostname: 'www.universkate.com',
            }
        ],
    },
    experimental: {
    },
    // reactStrictMode: true,
    // distDir: 'dist',
    // output: 'export'
    // reactStrictMode: true,
    async redirects() {
        return [
            // Example redirects - replace these with your actual redirect needs
            {
                source: '/product-category/women',
                destination: '/shop/category/women',
                permanent: true, // This sets up a 301 redirect
            },
            {
                source: '/product-category/women/dresses',
                destination: '/shop/category/women/dresses',
                permanent: true,
            },
            {
                source: '/product-category/men',
                destination: '/shop/category/men',
                permanent: true,
            },
            {
                source: '/product-category/women/formal-wear/',
                destination: '/shop/category/women/formal-wear',
                permanent: true,
            },
            {
                source: '/wishlist',
                destination: '/',
                permanent: true,
            },
            {
                source: '/help/shopping_online',
                destination: '/',
                permanent: true,
            },
            {
                source: '/portfolio',
                destination: '/',
                permanent: true,
            },
            {
                source: '/category/swimwear',
                destination: '/',
                permanent: true,
            },
            {
                source: '/refund_returns-2',
                destination: '/help/refund-returns',
                permanent: true,
            },
            {
                source: '/terms-conditions',
                destination: '/help/terms-of-service',
                permanent: true,
            },
            {
                source: '/sale',
                destination: '/offers',
                permanent: true,
            },
            {
                source: '/product-tag/jumpsuit/',
                destination: '/shop/category/women/jumpsuits',
                permanent: true,
            },
            {
                source: '/product-tag/denim',
                destination: '/shop/category/women/denim',
                permanent: true,
            },
        ];
    },
};

module.exports = withNextIntl(nextConfig);
