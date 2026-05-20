import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header1 from "@/app/newSite-components/headers/Header1";
import Topbar6 from "@/app/newSite-components/headers/Topbar6";
import RecentProducts from "@/app/newSite-components/otherPages/RecentProducts";
import ShopCart from "@/app/newSite-components/otherPages/ShopCart";
import Link from "next/link";

export default function ModaveCartPage() {
  return (
    <>
      <Topbar6 bgColor="bg-main" />
      <Header1 />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/newSite-images/section/page-title.jpg)" }}
      >
        <div className="container">
          <h3 className="heading text-center">Shopping Cart</h3>
          <ul className="breadcrumbs d-flex align-items-center justify-content-center">
            <li>
              <Link className="link" href="/">
                Homepage
              </Link>
            </li>
            <li>
              <i className="icon-arrRight" />
            </li>
            <li>
              <Link className="link" href="/shop-default-grid">
                Shop
              </Link>
            </li>
            <li>
              <i className="icon-arrRight" />
            </li>
            <li>Shopping Cart</li>
          </ul>
        </div>
      </div>

      <ShopCart />
      <RecentProducts />
      <Footer1 />
    </>
  );
}
