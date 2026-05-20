import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header1 from "@/app/newSite-components/headers/Header1";
import Topbar from "@/app/newSite-components/headers/Topbar";
import BannerCollection from "@/app/newSite-components/homes/home-1/BannerCollection";
import BannerCountdown from "@/app/newSite-components/homes/home-1/BannerCountdown";
import Collections from "@/app/newSite-components/homes/home-1/Collections";
import Features from "@/app/newSite-components/common/Features";
import Hero from "@/app/newSite-components/homes/home-1/Hero";
import Products from "@/app/newSite-components/common/Products3";
import ShopGram from "@/app/newSite-components/common/ShopGram";

const iconboxItems = [
  {
    id: 1,
    icon: "icon-return",
    title: "14-Day Returns",
    description: "Risk-free shopping with easy returns.",
  },
  {
    id: 2,
    icon: "icon-shipping",
    title: "Free Shipping",
    description: "No extra costs, just the price you see.",
  },
  {
    id: 3,
    icon: "icon-headset",
    title: "24/7 Support",
    description: "24/7 support, always here just for you.",
  },
  {
    id: 4,
    icon: "icon-sealCheck",
    title: "Member Discounts",
    description: "Special prices for our loyal customers.",
  },
];

export default function Home1Variant({ homeData, categories }) {
  return (
    <>
      <Topbar />
      <Header1 />
      <Hero data={homeData?.header?.slider || []} />
      <Collections data={categories || []} />
      <Products
        latestArrival={homeData?.latestArrival || []}
        products={[
          homeData?.latestArrival,
          homeData?.bestSelling,
          homeData?.trending,
          homeData?.hotSelling,
        ]}
      />
      <BannerCollection />
      <BannerCountdown />
      <ShopGram products={homeData?.hotSelling?.products || []} />
      <Features iconboxItems={iconboxItems} />
      <Footer1 />
    </>
  );
}
