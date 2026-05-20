"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ScrollTop from "@/app/newSite-components/common/ScrollTop";
import Context from "@/app/newSite-context/Context";
import RtlToggler from "@/app/newSite-components/common/RtlToggler";

const CartModal = dynamic(() => import("@/app/newSite-components/modals/CartModal"), {
  ssr: false,
});
const QuickView = dynamic(() => import("@/app/newSite-components/modals/QuickView"), {
  ssr: false,
});
const QuickAdd = dynamic(() => import("@/app/newSite-components/modals/QuickAdd"), {
  ssr: false,
});
const Compare = dynamic(() => import("@/app/newSite-components/modals/Compare"), {
  ssr: false,
});
const MobileMenu = dynamic(() => import("@/app/newSite-components/modals/MobileMenu"), {
  ssr: false,
});
const SearchModal = dynamic(() => import("@/app/newSite-components/modals/SearchModal"), {
  ssr: false,
});
const SizeGuide = dynamic(() => import("@/app/newSite-components/modals/SizeGuide"), {
  ssr: false,
});
const Wishlist = dynamic(() => import("@/app/newSite-components/modals/Wishlist"), {
  ssr: false,
});
const Categories = dynamic(() => import("@/app/newSite-components/modals/Categories"), {
  ssr: false,
});

export default function ShopClientShell({ children }) {
  const pathname = usePathname();
  const lastScrollY = useRef(0);
  const [scrollDirection, setScrollDirection] = useState("down");

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.esm");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector("header");
      if (!header) return;

      if (window.scrollY > 100) {
        header.classList.add("header-bg");
      } else {
        header.classList.remove("header-bg");
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setScrollDirection("up");
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > 250) {
        setScrollDirection(currentScrollY > lastScrollY.current ? "down" : "up");
      } else {
        setScrollDirection("down");
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [pathname]);

  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.esm").then((bootstrap) => {
      document.querySelectorAll(".modal.show").forEach((modal) => {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
          modalInstance.hide();
        }
      });

      document.querySelectorAll(".offcanvas.show").forEach((offcanvas) => {
        const offcanvasInstance = bootstrap.Offcanvas.getInstance(offcanvas);
        if (offcanvasInstance) {
          offcanvasInstance.hide();
        }
      });
    });
  }, [pathname]);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;

    header.style.top = scrollDirection === "up" ? "0px" : "-185px";
  }, [scrollDirection]);

  useEffect(() => {
    import("@/app/newSite-utlis/wow").then((module) => {
      const wow = new module.default({
        mobile: false,
        live: false,
      });
      wow.init();
    });
  }, [pathname]);

  return (
    <Context>
      <RtlToggler />
      <div id="wrapper">{children}</div>
      <CartModal />
      <QuickView />
      <QuickAdd />
      <Compare />
      <MobileMenu />
      <SearchModal />
      <SizeGuide />
      <Wishlist />
      <Categories />
      <ScrollTop />
    </Context>
  );
}
