import { Footer1 } from "@/templates/modave/components/footers";
import { Header1 } from "@/templates/modave/components/headers";
import { Topbar6 } from "@/templates/modave/components/headers";
import { Breadcumb, Descriptions1, Details1, RelatedProducts } from "@/templates/modave/components/product-details";

export default function ModaveProductDetailPage({ product }) {
  return (
    <>
      <Topbar6 bgColor="bg-main" />
      <Header1 />
      <Breadcumb product={product} />
      <Details1 product={product} />
      <Descriptions1 product={product} />
      <RelatedProducts product={product} />
      <Footer1 hasPaddingBottom />
    </>
  );
}
