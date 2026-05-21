import { Footer1 } from "@/templates/modave/components/footers";
import { Header1 } from "@/templates/modave/components/headers";
import { Topbar } from "@/templates/modave/components/headers";
import { Features } from "@/templates/modave/components/common";
import {
  Home1BannerCollection as BannerCollection,
  Home1BannerCountdown as BannerCountdown,
  Home1Collections as Collections,
  Home1Hero as Hero,
} from "@/templates/modave/components/homes";
import { Products3 as Products } from "@/templates/modave/components/common";
import { ShopGram } from "@/templates/modave/components/common";

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
