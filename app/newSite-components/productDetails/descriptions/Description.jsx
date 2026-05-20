import React from "react";

export default function Description({ product }) {
  const description =
    product?.description || product?.seoDescription || "No product description available.";
  const material = product?.material?.title;
  const composition = product?.materialComposition;
  const modelInfo = product?.modelInfo;

  return (
    <>
      <div className="right">
        <div className="letter-1 text-btn-uppercase mb_12">
          {product?.title || "Product Description"}
        </div>
        <p className="mb_12 text-secondary">{description}</p>
      </div>
      {material || composition || modelInfo ? (
        <div className="left">
          <div className="letter-1 text-btn-uppercase mb_12">
            Product Details
          </div>
          <ul className="list-text type-disc mb_12 gap-6">
            {material ? <li className="font-2">Material: {material}</li> : null}
            {composition ? (
              <li className="font-2">Composition: {composition}</li>
            ) : null}
            {modelInfo ? <li className="font-2">{modelInfo}</li> : null}
          </ul>
        </div>
      ) : null}
    </>
  );
}
