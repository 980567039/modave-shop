import BannerTab from "@/app/newSite-components/common/BannerTab";
import Features2 from "@/app/newSite-components/common/Features2";
import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header2 from "@/app/newSite-components/headers/Header2";
import Products from "@/app/newSite-components/common/Products";
import ShopGram from "@/app/newSite-components/common/ShopGram2";
import Collections from "./components/Collections";
import Collections2 from "./components/Collections2";
import Hero from "./components/Hero";
import Testimonials from "./components/Testimonials";
import { categories, collections3 as collections } from "@/app/newSite-data/collections";
import { iconboxItems } from "@/app/newSite-data/features";
import { slides3 as slides } from "@/app/newSite-data/heroSlides";
import { products } from "@/app/newSite-data/products";
import { testimonials2 as testimonials } from "@/app/newSite-data/testimonials";

export default function FashionMainVariant() {
  return (
    <>
      <Header2 />
      <Hero slides={slides} />
      <Collections categories={categories} />
      <BannerTab products={products} />
      <Products products={products} />
      <Collections2 collections={collections} />
      <Features2 iconboxItems={iconboxItems} />
      <Testimonials testimonials={testimonials} />
      <ShopGram products={products} />
      <Footer1 />
    </>
  );
}
