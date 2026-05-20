function getProductPrice(cartItems, product) {
    return cartItems.map((item) => {
      if (item.productId === product._id.$oid) {
        // Find the matching attribute based on size and color
        const matchingAttribute = product.attributes.find(attr => 
          attr.attributes.size.value === item.size && 
          attr.attributes.color.value === item.color
        );
  
        if (matchingAttribute) {
          return {
            // ...item,
            price: Number(parseFloat(product.price)) * Number(matchingAttribute?.quantity),
            quantity: Number(matchingAttribute.quantity),
            stock: matchingAttribute.stock,
            image: matchingAttribute.image || product.defaultImage.url,
          };
        } else {
          return {
            // ...item,
            price: Number(parseFloat(product.price)) * Number(product.quantity || 1),
            quantity: Number(product.quantity || 0),
            stock: product.inStock ? 'in-stock' : 'out-of-stock',
            image: product.defaultImage.url,
          };
        }
      }
      return item;
    });
  }
  
  export default getProductPrice;