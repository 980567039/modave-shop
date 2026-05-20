import { SiteProvider } from "@/app/contexts/siteContexts";
import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header1 from "@/app/newSite-components/headers/Header1";
import Topbar6 from "@/app/newSite-components/headers/Topbar6";
import OrderFailedContent from "@/templates/modave/components/OrderFailedContent";

export default function ModaveOrderFailedPage() {
  return (
    <SiteProvider>
      <Topbar6 bgColor="bg-main" />
      <Header1 />
      <OrderFailedContent />
      <Footer1 />
    </SiteProvider>
  );
}
