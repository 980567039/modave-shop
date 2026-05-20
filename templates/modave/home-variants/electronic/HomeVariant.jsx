import Brands from "@/app/newSite-components/common/Brands";
import Features from "@/app/newSite-components/common/Features";
import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header11 from "@/app/newSite-components/headers/Header11";
import Topbar6 from "@/app/newSite-components/headers/Topbar6";
import Banner from "./components/Banner";
import Categories from "./components/Categories";
import Collections from "./components/Collections";
import Collections2 from "./components/Collections2";
import Hero from "./components/Hero";
import Products from "./components/Products";
import Products2 from "./components/Products2";
import Products3 from "./components/Products3";
import Products4 from "./components/Products4";
import { brandsChicHaven } from "@/app/newSite-data/brands";
import {
  bannerDataElectronic,
  categories5,
  collectionItems6,
  slides as collections2Data,
} from "@/app/newSite-data/collections";
import { iconboxItems } from "@/app/newSite-data/features";
import { slides10 } from "@/app/newSite-data/heroSlides";
import { products } from "@/app/newSite-data/products";

export default function ElectronicVariant() {
  return (
    <>
      <Topbar6 />
      <Header11 />
      <Hero slides={slides10} />
      <Categories categories={categories5} />
      <Products products={products} />
      <Collections collections={collectionItems6} />
      <Products2 products={products} />
      <Banner data={bannerDataElectronic} />
      <Products3
        featuredProducts={products.slice(0, 3)}
        newArrivals={products.slice(3, 6)}
        maybeYouLike={products.slice(6, 9)}
      />
      <Products4 products={products} />
      <Collections2 collections={collections2Data} />
      <Features parentClass="flat-spacing-4 line-top-container" iconboxItems={iconboxItems} />
      <Brands parentClass="flat-spacing-5 line-top" brands={brandsChicHaven} />
      <Footer1 dark />
    </>
  );
}
