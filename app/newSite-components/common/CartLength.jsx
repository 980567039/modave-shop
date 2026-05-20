"use client";

import { useContextElement } from "@/app/newSite-context/Context";

export default function CartLength() {
  const { cartProducts } = useContextElement();
  return <>{cartProducts.length}</>;
}
