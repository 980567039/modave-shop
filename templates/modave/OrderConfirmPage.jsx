import { SiteProvider } from "@/app/contexts/siteContexts";
import PaymentConfirm from "@/app/components/theme/checkout/paymentConfirm";
import { Footer1 } from "@/templates/modave/components/footers";
import { Header1 } from "@/templates/modave/components/headers";
import { Topbar6 } from "@/templates/modave/components/headers";

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
