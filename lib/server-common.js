export function getShippingAddress(fData) {
  const { billingAddress, shippingAddress } = fData;

  // Check if shipping address is filled
  const isShippingAddressFilled = shippingAddress &&
    Object.values(shippingAddress).some(value =>
      value !== null && value !== undefined && value !== '');

  // Return shipping address if filled, otherwise return billing address
  return isShippingAddressFilled ? shippingAddress : billingAddress;
}
