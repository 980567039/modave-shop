// app/robots.js
const BASE_URL = process.env.NEXTAUTH_URL; 

export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/'],
      },
      sitemap: `${BASE_URL}/sitemap.xml`, 
    }
  }