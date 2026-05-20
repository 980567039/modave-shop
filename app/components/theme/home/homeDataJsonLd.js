export default function HomeDataJsonLd({
    store
}) {
    
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Nuvie Clothing",
        "url": "https://uptownsrilanka.com",
        "logo": "https://uptownsrilanka.com/images/main-logo.jpeg",
        "sameAs": [
            "https://www.facebook.com/uptownonlineonline",
            "https://www.instagram.com/uptown_selection",
            "https://wa.me/+94718995566/?text=Hi%2C%20anyone%20have%20a%20chat%3F",
            "https://www.tiktok.com/@uptownonline"
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+",
            "contactType": "customer service",
            "availableLanguage": ["English", "Sinhala"]
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}