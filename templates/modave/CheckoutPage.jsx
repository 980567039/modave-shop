"use client";

import { Footer1 } from "@/templates/modave/components/footers";
import { Header1 } from "@/templates/modave/components/headers";
import { Topbar6 } from "@/templates/modave/components/headers";
import { Checkout } from "@/templates/modave/components/other-pages";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function ModaveCheckoutPage() {
  const t = useTranslations("checkout");

  return (
    <>
      <Topbar6 bgColor="bg-main" />
      <Header1 />
      <div
        className="page-title"
        style={{ backgroundImage: "url(/newSite-images/section/page-title.jpg)" }}
      >
        <div className="container">
          <h3 className="heading text-center">{t("title")}</h3>
          <ul className="breadcrumbs d-flex align-items-center justify-content-center">
            <li>
              <Link className="link" href="/">
                {t("homepage")}
              </Link>
            </li>
            <li>
              <i className="icon-arrRight" />
            </li>
            <li>
              <Link className="link" href="/shop-default-grid">
                {t("shop")}
              </Link>
            </li>
            <li>
              <i className="icon-arrRight" />
            </li>
            <li>{t("viewCart")}</li>
          </ul>
        </div>
      </div>
      <Checkout />
      <Footer1 />
    </>
  );
}
