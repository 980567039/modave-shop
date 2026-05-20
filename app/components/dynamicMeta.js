import Head from 'next/head';
import { useState, useEffect } from 'react';

const DynamicMeta = ({ title, description, ogImage }) => {
  const [metaTitle, setMetaTitle] = useState(title);
  const [metaDescription, setMetaDescription] = useState(description);
  const [metaOgImage, setMetaOgImage] = useState(ogImage);

  useEffect(() => {
    // Update state when props change (optional)
    setMetaTitle(title);
    setMetaDescription(description);
    setMetaOgImage(ogImage);
  }, [title, description, ogImage]);

  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaOgImage} />
      {/* Add more meta tags as needed */}
    </Head>
  );
};

export default DynamicMeta;