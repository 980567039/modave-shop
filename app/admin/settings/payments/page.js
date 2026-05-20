"use client";

import { AdminContext } from "@/app/contexts/adminContexts";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { apiReq } from "@/lib/common";
import { Loader2 } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export default function Payments() {
    const [isLoading, setIsLoading] = useState(false);
    const { store, setStore } = useContext(AdminContext);

    const [paypal, setPaypal] = useState(false);
    const [stripe, setStripe] = useState(false);

    // ✅ 初始化 store 数据
    useEffect(() => {
        if (store?.payments) {
            setPaypal(store.payments.paypal ?? false);
            setStripe(store.payments.stripe ?? false);
        }
    }, [store]);

    // ✅ 保存提交
    const onSubmit = async () => {
        try {
            setIsLoading(true);

            const payload = {
                payments: {
                    paypal,
                    stripe,
                },
            };

            let res;

            if (store?._id) {
                res = await apiReq("admin/store", "PUT", {
                    ...payload,
                    id: store._id,
                });
            } else {
                res = await apiReq("admin/store", "POST", payload);
            }

            const { data } = await res.json();

            toast.success("支付设置已更新");

            setStore((prev) => ({
                ...prev,
                payments: data.payments,
            }));
        } catch (error) {
            console.error(error);
            toast.error("保存失败", { description: "请稍后再试" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-5">
            <div>
                <h2 className="font-semibold text-xl">支付设置</h2>
                <p className="text-muted-foreground text-sm">启用或关闭你的在线支付方式</p>
            </div>

            {/* ✅ PayPal */}
            <div className="flex items-center justify-between border rounded-lg p-4">
                <div>
                    <Label>PayPal</Label>
                    <p className="text-xs text-muted-foreground">
                        启用后，用户可使用 PayPal 支付
                    </p>
                </div>

                <Switch
                    id="paypal"
                    checked={paypal}
                    onCheckedChange={() => setPaypal(!paypal)}
                />
            </div>

            {/* ✅ Stripe */}
            <div className="flex items-center justify-between border rounded-lg p-4">
                <div>
                    <Label>Stripe</Label>
                    <p className="text-xs text-muted-foreground">
                        启用后，用户可使用银行卡付款
                    </p>
                </div>

                <Switch
                    id="stripe"
                    checked={stripe}
                    onCheckedChange={() => setStripe(!stripe)}
                />
            </div>

            {/* ✅ 保存按钮 */}
            <div className="flex justify-end">
                <Button onClick={onSubmit} disabled={isLoading}>
                    {isLoading && <Loader2 className="w-5 h-5 animate-spin mr-1" />}
                    保存
                </Button>
            </div>
        </div>
    );
}