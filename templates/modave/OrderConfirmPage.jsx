import { SiteProvider } from "@/app/contexts/siteContexts";
import PaymentConfirm from "@/app/components/theme/checkout/paymentConfirm";
import Footer1 from "@/app/newSite-components/footers/Footer1";
import Header1 from "@/app/newSite-components/headers/Header1";
import Topbar6 from "@/app/newSite-components/headers/Topbar6";

export default function ModaveOrderConfirmPage() {
  return (
    <SiteProvider>
      <Topbar6 bgColor="bg-main" />
      <Header1 />
      <PaymentConfirm />
      <Footer1 />
    </SiteProvider>
  );
}
