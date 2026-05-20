"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { apiReq } from "@/lib/common";
import { Ban } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OrderFailedContent() {
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const orderId = params.get("orderId");

  useEffect(() => {
    const removePastOrder = async () => {
      try {
        setIsLoading(true);
        const response = await apiReq("site/order", "POST", {
          orderId,
          isRemoveOrderCookies: true,
        });

        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    removePastOrder();
  }, [orderId]);

  return (
    <div>
      <div className="pt-[150px] relative text-center flex flex-col items-center gap-3" />

      <div className="xl:max-w-[87vw] mx-auto my-5 min-h-[40vh]">
        <div className="flex items-center justify-center flex-col gap-3 mb-10 text-center p-5 min-h-[50vh]">
          <Ban strokeWidth={0.5} className="w-40 h-40" />
          {isLoading ? (
            <Skeleton className="w-4/12 h-8" />
          ) : (
            <h1 className="text-3xl font-semibold mb-5 font-headingFontExtraBold uppercase">
              Payment Unsuccessful
            </h1>
          )}
          <p>
            Unfortunately, your payment could not be processed. Please double-check your payment
            details or try a different method.
          </p>
        </div>
      </div>
    </div>
  );
}
