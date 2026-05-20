import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header13 from "@/app/newSite-components/headers/Header13";
import Topbar7 from "@/app/newSite-components/headers/Topbar7";
import Banner from "./components/Banner";
import Categories from "./components/Categories";
import CollectionBanner from "./components/CollectionBanner";
import Collections from "./components/Collections";
import Features from "./components/Features";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Products2 from "./components/Products2";
import {
  bannerDataBaby,
  banners2,
  collections12,
  collections13,
} from "@/app/newSite-data/collections";
import { iconBoxesBaby } from "@/app/newSite-data/features";
import { slidesBaby } from "@/app/newSite-data/heroSlides";
import { products45, products46 } from "@/app/newSite-data/products";

export default function HomeBabyVariant({ homeData }) {
  return (
    <>
      <Topbar7 />
      <Header13 />
      <Hero slides={slidesBaby} />
      <Collections collections={collections12} />
      <Categories categories={collections13} />
      <Products products={homeData?.latestArrival?.products || products45} />
      <Features iconBoxes={iconBoxesBaby} />
      <Banner data={bannerDataBaby} />
      <Products2 products={homeData?.latestArrival?.products || products46} />
      <CollectionBanner banners={banners2} />
      <Footer1 dark />
    </>
  );
}
