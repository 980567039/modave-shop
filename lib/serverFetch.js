"use server"
export async function serverFetch(endpoint, options = {}) {
    const baseUrl = process.env.NEXTAUTH_URL;
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'origin': process.env.NEXTAUTH_URL,
        }
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
}