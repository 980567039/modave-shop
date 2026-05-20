import HeaderData from './headerData';
// Helper function to get the base URL
function getBaseUrl() {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
        return process.env.NEXT_PUBLIC_SITE_URL;
    }
    // Fallback for development
    if (process.env.SITE_ENV === 'development') {
        return 'http://localhost:5100';
    }
    // Fallback for production - adjust this according to your deployment
    return process.env.NEXTAUTH_URL;
}

async function getMainHeader() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/site/header`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'origin': process.env.NEXTAUTH_URL
            },
            next: {
                revalidate: 3600 // Revalidate every hour
            }
        });

        if (!res.ok) {
            throw new Error('Failed to fetch home data');
        }

        const { data } = await res.json();

        return data;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return null;
    }
}
export default async function ThemeHeader() {

    const headerData = await getMainHeader();
    

    return (
        <HeaderData data={headerData}/>
    );
}