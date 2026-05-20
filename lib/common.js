"use client";

import { useCallback, useEffect, useRef } from "react";

export const colors = {
  youtuber: [
    { name: "Red", hex: "#FF5733" },
    { name: "Orange", hex: "#FFBD33" },
    { name: "Yellow", hex: "#FFEA33" },
    { name: "Green", hex: "#33FF57" },
    { name: "Blue", hex: "#3366FF" },
    { name: "Purple", hex: "#7733FF" },
    { name: "Pink", hex: "#FF33EA" },
    //   { name: "White", hex: "#FFFFFF" },
    { name: "Black", hex: "#000000" },
    { name: "Silver", hex: "#C0C0C0" },
  ],
  tiktoker: [
    { name: "Neon Green", hex: "#39FF14" },
    { name: "Neon Pink", hex: "#FF1493" },
    { name: "Neon Yellow", hex: "#FFFF00" },
    { name: "Neon Orange", hex: "#FFA500" },
    { name: "Neon Blue", hex: "#00FFFF" },
    { name: "Neon Purple", hex: "#8A2BE2" },
    { name: "Neon Red", hex: "#FF4500" },
    { name: "Hot Pink", hex: "#FF69B4" },
    { name: "Lime Green", hex: "#32CD32" },
    { name: "Turquoise", hex: "#40E0D0" },
  ],
  vlogger: [
    { name: "Dark Slate Gray", hex: "#2F4F4F" },
    { name: "Medium Aquamarine", hex: "#66CDAA" },
    { name: "Light Salmon", hex: "#FFA07A" },
    { name: "Gold", hex: "#FFD700" },
    { name: "Crimson", hex: "#DC143C" },
    { name: "Deep Sky Blue", hex: "#00BFFF" },
    { name: "Medium Purple", hex: "#9370DB" },
    { name: "Lavender", hex: "#E6E6FA" },
    { name: "Slate Blue", hex: "#6A5ACD" },
    { name: "Light Coral", hex: "#F08080" },
  ],
  influencers: [
    { name: "Forest Green", hex: "#228B22" },
    { name: "Sienna", hex: "#A0522D" },
    { name: "Dark Orchid", hex: "#9932CC" },
    { name: "Saddle Brown", hex: "#8B4513" },
    { name: "Dark Olive Green", hex: "#556B2F" },
    { name: "Medium Violet Red", hex: "#C71585" },
    { name: "Goldenrod", hex: "#DAA520" },
    { name: "Cornflower Blue", hex: "#6495ED" },
    { name: "Medium Spring Green", hex: "#00FA9A" },
    { name: "Light Steel Blue", hex: "#B0C4DE" },
  ],
  traveller: [
    { name: "Sandy Brown", hex: "#F4A460" },
    { name: "Peru", hex: "#CD853F" },
    { name: "Chocolate", hex: "#D2691E" },
    { name: "Khaki", hex: "#F0E68C" },
    { name: "Olive", hex: "#808000" },
    { name: "Dark Khaki", hex: "#BDB76B" },
    { name: "Dark Salmon", hex: "#E9967A" },
    { name: "Rosy Brown", hex: "#BC8F8F" },
    { name: "Medium Aquamarine", hex: "#66CDAA" },
    { name: "Pale Goldenrod", hex: "#EEE8AA" },
  ],
  singer: [
    { name: "Deep Pink", hex: "#FF1493" },
    { name: "Medium Orchid", hex: "#BA55D3" },
    { name: "Violet", hex: "#EE82EE" },
    { name: "Dark Magenta", hex: "#8B008B" },
    { name: "Orchid", hex: "#DA70D6" },
    { name: "Fuchsia", hex: "#FF00FF" },
    { name: "Medium Purple", hex: "#9370DB" },
    { name: "Thistle", hex: "#D8BFD8" },
    { name: "Plum", hex: "#DDA0DD" },
    { name: "Lavender", hex: "#E6E6FA" },
  ],
  actor: [
    { name: "Sky Blue", hex: "#87CEEB" },
    { name: "Powder Blue", hex: "#B0E0E6" },
    { name: "Light Blue", hex: "#ADD8E6" },
    { name: "Light Sky Blue", hex: "#87CEFA" },
    { name: "Deep Sky Blue", hex: "#00BFFF" },
    { name: "Dodger Blue", hex: "#1E90FF" },
    { name: "Light Steel Blue", hex: "#B0C4DE" },
    { name: "Steel Blue", hex: "#4682B4" },
    { name: "Cornflower Blue", hex: "#6495ED" },
    { name: "Alice Blue", hex: "#F0F8FF" },
  ],
  musician: [
    { name: "Gold", hex: "#FFD700" },
    { name: "Goldenrod", hex: "#DAA520" },
    { name: "Dark Goldenrod", hex: "#B8860B" },
    { name: "Burlywood", hex: "#DEB887" },
    { name: "Blanched Almond", hex: "#FFEBCD" },
    { name: "Peach Puff", hex: "#FFDAB9" },
    { name: "Navajo White", hex: "#FFDEAD" },
    { name: "Moccasin", hex: "#FFE4B5" },
    { name: "Wheat", hex: "#F5DEB3" },
    { name: "Old Lace", hex: "#FDF5E6" },
  ],
  businessOwner: [
    { name: "Dark Orange", hex: "#FF8C00" },
    { name: "Orange Red", hex: "#FF4500" },
    { name: "Firebrick", hex: "#B22222" },
    { name: "Indian Red", hex: "#CD5C5C" },
    { name: "Rosy Brown", hex: "#BC8F8F" },
    { name: "Light Coral", hex: "#F08080" },
    { name: "Light Salmon", hex: "#FFA07A" },
    { name: "Salmon", hex: "#FA8072" },
    { name: "Dark Salmon", hex: "#E9967A" },
    { name: "Coral", hex: "#FF7F50" },
  ],
  doctor: [
    { name: "Medium Turquoise", hex: "#48D1CC" },
    { name: "Light Sea Green", hex: "#20B2AA" },
    { name: "Medium Aquamarine", hex: "#66CDAA" },
    { name: "Cadet Blue", hex: "#5F9EA0" },
    { name: "Dark Cyan", hex: "#008B8B" },
    { name: "Teal", hex: "#008080" },
    { name: "Light Cyan", hex: "#E0FFFF" },
    { name: "Pale Turquoise", hex: "#AFEEEE" },
    { name: "Aqua", hex: "#00FFFF" },
    { name: "Dark Turquoise", hex: "#00CED1" },
  ],
  photographer: [
    { name: "Dark Slate Gray", hex: "#2F4F4F" },
    { name: "Slate Gray", hex: "#708090" },
    { name: "Dim Gray", hex: "#696969" },
    { name: "Dark Gray", hex: "#A9A9A9" },
    { name: "Light Gray", hex: "#D3D3D3" },
    { name: "Gainsboro", hex: "#DCDCDC" },
    { name: "White Smoke", hex: "#F5F5F5" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "Dark Red", hex: "#8B0000" },
    { name: "Brown", hex: "#A52A2A" },
  ],
};


export const checkEmailAddress = (email, onlyReg) => {
  // Regular expression for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (onlyReg) {
    // Check if the email format is valid
    if (!emailRegex.test(email)) {
      return false;
    }

    // Check if the email address contains a dot right after the @ symbol
    if (email.indexOf('@.') !== -1) {
      return false;
    }
    return emailRegex.test(email);
  } else {

    // Check if the email format is valid
    if (!emailRegex.test(email)) {
      return false;
    }
    // Get the domain part of the email
    const domain = email.split('@')[1];

    // Check if the domain part ends with any of the email extensions
    const validExtensions = [
      ".com",
      ".net",
      ".org",
      ".gov",
      ".edu",
      ".info",
      ".biz",
      ".co",
      ".uk",
      ".us",
      ".ca",
      ".au",
      ".de",
      ".fr",
      ".jp",
      ".ru",
      ".cn",
      ".it",
      ".nl",
      ".br",
      ".es",
      ".mx",
      ".se",
      ".ch",
      ".at",
      ".dk",
      ".no",
      ".fi",
      ".be",
      ".gr",
      ".pl",
      ".cz",
      ".hu",
      ".ro",
      ".pt",
      ".tr",
      ".kr",
      ".il",
      ".in",
      ".sg",
      ".my",
      ".id",
      ".vn",
      ".th",
      ".ph",
      ".ae",
      ".sa",
      ".eg",
      ".za",
      ".ng",
      ".ke",
      ".gh",
      ".ke",
      ".ug",
      ".cm",
      ".ma",
      ".dz",
      ".tn",
      ".ua",
      ".by",
      ".kz",
      ".uz",
      ".az",
      ".md",
      ".ba",
      ".hr",
      ".sk",
      ".si",
      ".lt",
      ".lv",
      ".ee",
      ".ge",
      ".am",
      ".kg",
      ".tj",
      ".tm",
      ".af",
      ".np",
      ".bd",
      ".lk"
    ];

    const isValidExtension = validExtensions.some(extension => domain.endsWith(extension));

    return isValidExtension;
  }
}

export const isValidUsername = (username) => {
  // Regular expression for username validation
  const usernameRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*$/;

  // Check if the username format is valid
  if (!usernameRegex.test(username)) {
    return false;
  }

  // Check if the username starts with a letter or number
  if (!/^[a-zA-Z0-9]/.test(username)) {
    return false;
  }

  // Check if the username ends with a letter or number
  if (!/[a-zA-Z0-9]$/.test(username)) {
    return false;
  }

  return true;
};

export const apiReq = async (url, method, payload, headers) => {
  try {
    const requestOptions = {
      method: method || "POST"
    };

    // Set headers based on whether payload is FormData or not
    if (payload instanceof FormData) {
      // For FormData, don't set Content-Type - browser will set it automatically
      requestOptions.headers = {
        'origin': process.env.NEXTAUTH_URL,
        ...(headers || {})
      };
      requestOptions.body = payload; // Send FormData directly
    } else {
      // For regular JSON requests
      requestOptions.headers = {
        "Content-Type": "application/json",
        'origin': process.env.NEXTAUTH_URL,
        ...(headers || {})
      };
      // Only add body if method is POST, PUT, or PATCH
      if (method === "POST" || method === "PUT" || method === "PATCH") {
        requestOptions.body = JSON.stringify(payload);
      }
    }

    const res = await fetch(`/api/${url}`, requestOptions);
    return res;
  } catch (error) {
    console.error("Error in API request:", error);
    throw error;
  }
};


//货币转换
export const formatPrice = (amount) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'LKR',
    // minimumFractionDigits: 0, // No decimal places
    // maximumFractionDigits: 0  // No decimal places
  }).format(amount);

  // Replace the 'LKR' or '₨' with 'Rs'
  return formatted.replace(/LKR|₨/, 'USD');
};

export const getCartTotal = (cart) => {
  if (cart && cart.length > 0) {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.salesPrice || item.price); // Convert price to a number
      const subtotal = price * item.quantity;
      return total + subtotal;
    }, 0);
  }
}

export const getTypeOfAttribute = (product, type) => {
  const attributes = product?.attributes;

  if (attributes) {
    const filterType = attributes?.map(attr => attr.attributes[type])

    const seen = new Set();

    const uniqueArray = filterType.filter(item => {
      const duplicate = seen.has(item.value);
      seen.add(item.value);
      return !duplicate;
    });
    return uniqueArray;
  }
}





export function getComplementaryColor(color) {
  // Remove the hash at the start if it's there
  color = color.replace(/^#/, '');

  // Parse the r, g, b values
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  // Get the complementary color
  const compR = (255 - r).toString(16).padStart(2, '0');
  const compG = (255 - g).toString(16).padStart(2, '0');
  const compB = (255 - b).toString(16).padStart(2, '0');

  // Return the complementary color
  return `#${compR}${compG}${compB}`;
}


export function commonColors(type) {
  const colors = [
    "slate", "gray", "zinc", "neutral", "stone", "red", "orange",
    "amber", "yellow", "lime", "green", "emerald", "teal", "cyan",
    "sky", "blue", "indigo", "violet", "purple", "fuchsia", "pink", "rose"
  ];

  const colorGroups = {};

  colors.forEach(color => {
    const generateColors = [];
    for (let counter = 400; counter <= 950; counter += 100) {
      generateColors.push(`${type}-${color}-${counter}`);
    }
    colorGroups[`${type}-${color}-600`] = [...generateColors, `${type}-${color}-600`];
  });

  return colorGroups;
}


export function isSameObjects(obj1, obj2) {
  if (obj1 === obj2) {
    return true; // Identical objects
  }

  if (obj1 == null || obj2 == null || typeof obj1 !== 'object' || typeof obj2 !== 'object') {
    return false; // Not objects or one is null
  }

  let keys1 = Object.keys(obj1);
  let keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false; // Different number of properties
  }

  for (let key of keys1) {
    if (!keys2.includes(key) || !isSameObjects(obj1[key], obj2[key])) {
      return false; // Key not found in both objects or values are not equal
    }
  }

  return true;
}

export function mergeValuesOnly(obj1, obj2) {
  for (let key in obj2) {
    if (obj2[key] instanceof Object && key in obj1) {
      if (key === 'values') {
        // If the key is 'values', merge the values from obj2 into obj1
        for (let valueKey in obj2[key]) {
          obj1[key][valueKey] = obj2[key][valueKey];
        }
      } else {
        mergeValuesOnly(obj1[key], obj2[key]);
      }
    }
  }
  return obj1;
};


// export function useDebouncedSave(callback, delay, dependencies) {
//   const handler = useRef(null);

//   const memoizedCallback = useCallback(callback, dependencies);

//   useEffect(() => {
//     if (handler.current) {
//       clearTimeout(handler.current);
//     }

//     handler.current = setTimeout(() => {
//       memoizedCallback();
//     }, delay);

//     // Clear the timeout if dependencies change or component unmounts
//     return () => {
//       if (handler.current) {
//         clearTimeout(handler.current);
//       }
//     };
//   }, [memoizedCallback, delay]);

//   // Optionally, you can return a function to force an immediate save
//   const flush = () => {
//     if (handler.current) {
//       clearTimeout(handler.current);
//       memoizedCallback();
//     }
//   };

//   return flush;
// }


export function orderStatus() {
  return [
    {
      value: "pending",
      label: "Pending",
    },

    {
      value: "confirmed",
      label: "Confirmed",
    },
    {
      value: "processing",
      label: "Processing",
    },
    {
      value: "awaitingFulfillment",
      label: "Awaiting Fulfillment",
    },
    {
      value: "awaitingShipment",
      label: "Awaiting Shipment",
    },
    {
      value: "shipped",
      label: "Shipped",
    },
    {
      value: "outForDelivery",
      label: "Out for Delivery",
    },
    {
      value: "delivered",
      label: "Delivered",
    },
    {
      value: "completed",
      label: "Completed",
    },
    {
      value: "onHold",
      label: "On Hold",
    },
    {
      value: "cancelled",
      label: "Cancelled",
    },
    {
      value: "failed",
      label: "Failed",
    },
    {
      value: "refunded",
      label: "Refunded",
    },
    {
      value: "awaitingPayment",
      label: "Awaiting Payment",
    },
    {
      value: "confirmPayment",
      label: "Confirm Payment",
    },
    {
      value: "paymentFailed",
      label: "Payment Failed",
    },
    {
      value: "paymentCancel",
      label: "Payment Cancel",
    },
  ];
}

export function orderPaymentStatus() {
  return [
    {
      value: "awaitingPayment",
      label: "Awaiting Payment",
    },
    {
      value: "confirmPayment",
      label: "Payment Confirm",
    },
    {
      value: "paymentFailed",
      label: "Payment Failed",
    },
    {
      value: "paymentCancel",
      label: "Payment Cancel",
    },
    // {
    //   value: "processing",
    //   label: "Processing",
    // },
    // {
    //   value: "onHold",
    //   label: "On Hold",
    // },
    {
      value: "refunded",
      label: "Refunded",
    }
  ];
}

export function formatCategories(categories, parentId = "", level = 0, parentSlug = "") {
  let formattedCategories = [];
  categories
    .filter(category => category.parentId === parentId)
    .forEach(category => {
      const currentSlug = parentSlug ? `${parentSlug}/${category.slug}` : category.slug;
      formattedCategories.push({
        ...category,
        title: "-".repeat(level) + category.title,
        url: `/${currentSlug}`
      });
      formattedCategories = formattedCategories.concat(formatCategories(categories, category._id, level + 1, currentSlug));
    });
  return formattedCategories;
};

export function generateSlug(val) {
  const cleanedStr = val.replace(/[^\w\s]/gi, '');
  // Replace spaces with hyphens
  const hyphenatedStr = cleanedStr.replace(/\s+/g, '-');
  const lowerSlug = hyphenatedStr.toLowerCase();

  return lowerSlug

}

// Utility function to get non-empty attributes
export function getNonEmptyAttributes(array) {
  const returnArg = array
    .map(item => {
      const filledAttributes = {};

      // Iterate over the attributes object
      for (const [key, value] of Object.entries(item.attributes)) {
        if (value) {
          filledAttributes[key] = value;
        }
      }

      // Only return items with non-empty attributes
      if (Object.keys(filledAttributes).length > 0) {
        return {
          ...item,
          attributes: filledAttributes
        };
      } else {
        return null; // return null if there are no filled attributes
      }
    })
    .filter(item => item !== null); // filter out null values

  return returnArg
};



export function generateMetaData(meta) {
  return metadata = {
    title: "TEST Clothing",
    description: "Generated by create next app",
  }
};

export function getShippingAddress(fData) {
  const { billingAddress, shippingAddress } = fData;

  // Check if shipping address is filled
  const isShippingAddressFilled = shippingAddress &&
    Object.values(shippingAddress).some(value =>
      value !== null && value !== undefined && value !== '');

  // Return shipping address if filled, otherwise return billing address
  return isShippingAddressFilled ? shippingAddress : billingAddress;
}


export async function checkStock(cart) {
  // check stock count
  const res = await apiReq('site/cart/check-stock', 'POST', {
    cartItems: cart,
  });

  const respond = await res.json();

  return {
    ...respond,
    res
  };
}


export const getFullDomain = (includePathname = false) => {
  if (typeof window === 'undefined') {
    return '';
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port ? `:${window.location.port}` : '';
  const pathname = includePathname ? window.location.pathname : '';

  return `${protocol}//${hostname}${port}`;
};
export const transformS3UrlsInObject = (obj) => {
  // Return if obj is null or not an object
  if (!obj || typeof obj !== 'object') {
    if (typeof obj === 'string' && obj.includes('uptown-selections.s3.eu-north-1.amazonaws.com')) {
      const fileId = obj.split('/').pop();
      return `/uploads/${fileId}.webp`;
    }
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => transformS3UrlsInObject(item));
  }

  // Handle objects
  const transformed = { ...obj }; // Create a shallow copy to preserve original structure

  // Check if the object has a url property that needs transformation
  if (transformed.url && typeof transformed.url === 'string' &&
    transformed.url.includes('uptown-selections.s3.eu-north-1.amazonaws.com')) {
    const fileId = transformed.url.split('/').pop();
    transformed.url = `/uploads/${fileId}.webp`;
  }

  // Transform image URLs in nested objects
  if (transformed.defaultImage) {
    transformed.defaultImage = transformS3UrlsInObject(transformed.defaultImage);
  }
  if (transformed.imageGallery) {
    transformed.imageGallery = transformS3UrlsInObject(transformed.imageGallery);
  }
  if (transformed.image) {
    transformed.image = transformS3UrlsInObject(transformed.image);
  }

  return transformed;
}

export const formatImageUrl = (url) => {
  if (!url) return 'https://dummyimage.com/400x400/ddd/000';

  // If the URL already starts with /uploads, return as is
  if (url.startsWith('/uploads/')) {
    return url;
  }

  // If it's an S3 URL, extract the filename and convert to /uploads format
  if (url.includes('uptown-selections.s3.eu-north-1.amazonaws.com/')) {
    const filename = url.split('/').pop();
    return `/uploads/${filename}.webp`;
  }

  // If it's just the filename, add the /uploads prefix and .webp extension
  if (!url.includes('/')) {
    return `/uploads/${url}.webp`;
  }

  return url;
};

export const accessThisRoles = (role) => {
  const acceptRoles = ['admin', 'sales', 'manager', 'marketing', 'inventoryManager'];
  return acceptRoles.some((d) => d === role);
}

export const onlyFirstLetter = (str) => {
  if (str?.includes("small") || str?.includes("medium") || str?.includes("large")) {
    return str.charAt(0).toUpperCase();
  } else if (str?.includes("free")) {
    return str + ' Size';
  } else {
    return str;
  }
}

const ROLE_CAPABILITIES = {
  admin: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'orders', label: 'Orders' },
    { id: 'products', label: 'Products' },
    { id: 'attributes', label: 'Attributes' },
    { id: 'categories', label: 'Categories' },
    { id: 'theme', label: 'Theme' },
    { id: 'settings', label: 'Settings' },
  ],
  manager: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'attributes', label: 'Attributes' },
    { id: 'categories', label: 'Categories' }
  ],
  sales: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'attributes', label: 'Attributes' },
    { id: 'categories', label: 'Categories' }
  ],
  marketing: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'attributes', label: 'Attributes' },
    { id: 'categories', label: 'Categories' }
  ],
  inventoryManager: [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'attributes', label: 'Attributes' },
    { id: 'categories', label: 'Categories' }
  ],

};

export function generateCategoryUrls(categories) {
  // Create a map for quick lookup of categories by ID
  const categoryMap = {};
  categories.forEach(category => {
    categoryMap[category._id] = category;
  });

  // Function to build the complete URL path for a category
  function buildCategoryPath(category) {
    // Base path structure
    let path = '/shop/category';

    if (!category) return path;

    // If it has a parent, find the parent's path first
    if (category.parentId && categoryMap[category.parentId]) {
      const parent = categoryMap[category.parentId];

      // Check if parent itself has a parent (is a subcategory)
      if (parent.parentId && categoryMap[parent.parentId]) {
        const grandParent = categoryMap[parent.parentId];
        // Multi-level path: grandparent/parent/category
        path += `/${grandParent.slug}/${parent.slug}/${category.slug}`;
      } else {
        // Single-level path: parent/category
        path += `/${parent.slug}/${category.slug}`;
      }
    } else {
      // No parent, this is a main category
      path += `/${category.slug}`;
    }

    return path;
  }

  // Generate correct URLs for all categories
  return categories.map(category => {
    return {
      ...category,
      generatedUrl: buildCategoryPath(category)
    };
  });
}