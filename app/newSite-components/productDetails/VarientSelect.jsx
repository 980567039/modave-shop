"use client";

const VariantPicker = ({ selectedVariant, setSelectedVariant, variants }) => {
  const handleVariantClick = (size) => {
    setSelectedVariant(size);
  };

  return (
    <div className="variant-picker-item">
      <div className="variant-picker-label mb_12">
        Size:
        <span className="text-title variant-picker-label-value value-currentVariant">
          {selectedVariant}
        </span>
      </div>
      <div className="variant-picker-values variant-other-size">
        {variants.map((variant) => (
          <div
            key={variant.size}
            className={`btn-size other-variant-btn ${
              variant.size === selectedVariant ? "active" : ""
            }`}
            onClick={() => handleVariantClick(variant.size)}
          >
            {variant.size}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VariantPicker;
