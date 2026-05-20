// app/components/ProductJsonLd.js
export default function ProductJsonLd({
    name,
    description,
    sku,
    gtin,
    gtin8,
    gtin13,
    gtin14,
    mpn,
    brand,
    images = [],
    offers = {},
    aggregateRating,
    review,
  }) {
    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description,
      ...(sku && { sku }),
      ...(gtin && { gtin }),
      ...(gtin8 && { gtin8 }),
      ...(gtin13 && { gtin13 }),
      ...(gtin14 && { gtin14 }),
      ...(mpn && { mpn }),
      ...(brand && {
        brand: {
          "@type": "Brand",
          name: brand,
        },
      }),
      ...(images.length > 0 && { image: images }),
      ...(offers && {
        offers: {
          "@type": "Offer",
          availability: offers.availability || "https://schema.org/InStock",
          price: offers.price,
          priceCurrency: offers.priceCurrency,
          url: offers.url,
          priceValidUntil: offers.priceValidUntil,
          itemCondition: offers.itemCondition || "https://schema.org/NewCondition",
          ...(offers.seller && {
            seller: {
              "@type": "Organization",
              name: offers.seller,
            },
          }),
        },
      }),
      ...(aggregateRating && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: aggregateRating.ratingValue,
          reviewCount: aggregateRating.reviewCount,
        },
      }),
      ...(review && {
        review: {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: review.ratingValue,
            bestRating: review.bestRating,
          },
          author: {
            "@type": "Person",
            name: 'Nuvie Clothings',
          },
        },
      }),
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  }