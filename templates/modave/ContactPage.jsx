import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header1 from "@/app/newSite-components/headers/Header1";
import Topbar6 from "@/app/newSite-components/headers/Topbar6";
import Contact2 from "@/app/newSite-components/otherPages/Contact2";
import React from "react";

export default function ContactPage() {
  return (
    <>
      <Topbar6 bgColor="bg-main" />
      <Header1 />
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.712380803123!2d-74.00594108459235!3d40.712775279328264!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a3168ef8b1f%3A0xe28a875ee38c8ed1!2sNew+York%2C+NY%2C+USA!5e0!3m2!1sen!2s!4v1617203294845!5m2!1sen!2s"
        width={600}
        height={450}
        style={{ border: 0, width: "100%" }}
        allowFullScreen=""
        loading="lazy"
      />
      <Contact2 />
      <Footer1 />
    </>
  );
}
