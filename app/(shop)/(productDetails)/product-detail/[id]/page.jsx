import { getProductById } from "@/shared/api/products";
import { ActiveProductDetailPage as ProductDetailTemplate } from "@/templates/pages";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Product Detail || Modave - Multipurpose React Nextjs eCommerce Template",
  description: "Modave - Multipurpose React Nextjs eCommerce Template",
};

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailTemplate product={product} />;
}
