import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header1 from "@/app/newSite-components/headers/Header1";
import Topbar6 from "@/app/newSite-components/headers/Topbar6";
import Breadcumb from "@/app/newSite-components/productDetails/Breadcumb";
import Descriptions1 from "@/app/newSite-components/productDetails/descriptions/Descriptions1";
import Details1 from "@/app/newSite-components/productDetails/details/Details1";
import RelatedProducts from "@/app/newSite-components/productDetails/RelatedProducts";

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
