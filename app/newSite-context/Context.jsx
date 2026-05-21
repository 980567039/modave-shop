"use client";
import { openCartModal } from "@/app/newSite-utlis/openCartModal";
import { openWistlistModal } from "@/app/newSite-utlis/openWishlist";
import { apiReq } from "@/lib/common";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import React, { useEffect } from "react";
import { useContext, useState } from "react";
const dataContext = React.createContext();
export const useContextElement = () => {
  return useContext(dataContext);
};

const getProductId = (product) => {
  if (!product) return null;
  return typeof product === "object"
    ? product._id || product.id || product.productId
    : product;
};

const getClientIpAddress = async () => {
  if (process.env.NODE_ENV === "development") {
    return "";
  }

  try {
    const response = await fetch("https://api64.ipify.org?format=json");
    if (!response.ok) {
      return "";
    }

    const data = await response.json();
    return data?.ip || "";
  } catch {
    return "";
  }
};

export default function Context({ children }) {
  const [cartProducts, setCartProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [compareItem, setCompareItem] = useState([]);
  const [quickViewItem, setQuickViewItem] = useState(null);
  const [quickAddItem, setQuickAddItem] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [uniqueID, setUniqueID] = useState(null);
  const [browserInfo, setBrowserInfo] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeUser = async () => {
      let storedID = localStorage.getItem("uniqueID");
      if (!storedID) {
        storedID = "_" + Math.random().toString(36).substr(2, 19);
        localStorage.setItem("uniqueID", storedID);
      }
      setUniqueID(storedID);
      setBrowserInfo(window.navigator.userAgent);

      setIpAddress(await getClientIpAddress());
    };

    initializeUser();
  }, []);
  useEffect(() => {
    const subtotal = cartProducts.reduce((accumulator, product) => {
      return accumulator + product.quantity * product.price;
    }, 0);
    setTotalPrice(subtotal);
  }, [cartProducts]);

  const isAddedToCartProducts = (id) => {
    if (cartProducts.some((elm) => getProductId(elm) == id)) {
      return true;
    }
    return false;
  };
  const addProductToCart = async (productItem, qty, isModal = true) => {
    const product = productItem;
    if (!product) return;

    const productId = product._id || product.id;

    let cartItem;
    const existingItem = cartProducts.find(
      (item) => item.productId === productId
    );

    if (existingItem) {
      const updatedCart = cartProducts.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + (qty || 1) }
          : item
      );
      cartItem = updatedCart;
    } else {
      const updatedCart = [
        ...cartProducts,
        {
          ...product,
          productId: productId,
          title: product.title,
          slug: product.titleSlug || product.slug,
          price: product.price,
          salePrice: product.salePrice || product.price,
          image: product.mainImage || product.imgSrc || product.image || product.defaultImage?.url,
          quantity: qty || 1,
          size: product.selectedSize || (product.selectedVariant ? product.selectedVariant.split(', ')[1] : ""),
          color: product.selectedColor || (product.selectedVariant ? product.selectedVariant.split(', ')[0] : ""),
          stock: Number(product?.availableStock || product.stock || 100),
          sku: product?.sku || '',
          randomKey: uuidv4(),
          isGiftCard: product?.isGiftCard || false
        },
      ];
      cartItem = updatedCart;
    }

    if (cartItem && cartItem.length > 0) {
      try {
        setIsLoading(true);
        const url = "site/cart";
        const res = await apiReq(url, "POST", {
          uniqueID,
          cart: cartItem,
          ip: ipAddress || "",
          browser: browserInfo || "",
        });

        if (res && res.status === 200) {
          const { data } = await res.json();
          setCartProducts(data.cart);

          toast.success("Item added to cart", {
            description: `${product?.title} is added to cart`,
          });

          if (isModal) {
            openCartModal();
          }
        } else {
          console.log("Failed to save cart data:", res.statusText);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error saving cart data:", error);
        toast.error("Something went wrong!", {
          description: `please try again later`,
        });
        setIsLoading(false);
      }
    }
  };

  const updateQuantity = (id, qty) => {
    if (isAddedToCartProducts(id)) {
      let item = cartProducts.filter((elm) => getProductId(elm) == id)[0];
      let items = [...cartProducts];
      const itemIndex = items.indexOf(item);

      item.quantity = qty / 1;
      items[itemIndex] = item;
      setCartProducts(items);
    }
  };

  const addToWishlist = (product) => {
    const id = getProductId(product);

    if (!id) return;

    if (!wishList.some((item) => getProductId(item) == id)) {
      setWishList((pre) => [...pre, product]);
      openWistlistModal();
    }
  };

  const removeFromWishlist = (id) => {
    if (wishList.some((item) => getProductId(item) == id)) {
      setWishList((pre) => [...pre.filter((elm) => getProductId(elm) != id)]);
    }
  };
  const addToCompareItem = (product) => {
    const id = getProductId(product);

    if (!id) return;

    if (!compareItem.some((item) => getProductId(item) == id)) {
      setCompareItem((pre) => [...pre, product]);
    }
  };
  const removeFromCompareItem = (id) => {
    if (compareItem.some((item) => getProductId(item) == id)) {
      setCompareItem((pre) => [...pre.filter((elm) => getProductId(elm) != id)]);
    }
  };
  const isAddedtoWishlist = (id) => {
    if (wishList.some((item) => getProductId(item) == id)) {
      return true;
    }
    return false;
  };
  const isAddedtoCompareItem = (id) => {
    if (compareItem.some((item) => getProductId(item) == id)) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("cartList"));
    if (items?.length) {
      setCartProducts(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cartList", JSON.stringify(cartProducts));
  }, [cartProducts]);
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist"));
    if (items?.length) {
      setWishList(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishList));
  }, [wishList]);

  const contextElement = {
    cartProducts,
    setCartProducts,
    totalPrice,
    addProductToCart,
    isAddedToCartProducts,
    removeFromWishlist,
    addToWishlist,
    isAddedtoWishlist,
    quickViewItem,
    wishList,
    setQuickViewItem,
    quickAddItem,
    setQuickAddItem,
    addToCompareItem,
    isAddedtoCompareItem,
    removeFromCompareItem,
    compareItem,
    setCompareItem,
    updateQuantity,
  };
  return (
    <dataContext.Provider value={contextElement}>
      {children}
    </dataContext.Provider>
  );
}
