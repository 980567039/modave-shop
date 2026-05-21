import { SiteProvider } from "@/app/contexts/siteContexts";
import { Footer1 } from "@/templates/modave/components/footers";
import { Header1 } from "@/templates/modave/components/headers";
import { Topbar6 } from "@/templates/modave/components/headers";
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
