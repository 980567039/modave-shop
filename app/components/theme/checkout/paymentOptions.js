import { SiteContext } from '@/app/contexts/siteContexts';
import { CustomSwitch } from '@/components/ui/front-switch';
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { formatPrice, getCartTotal } from '@/lib/common';
import { Banknote, Check, CirclePercent, Copy } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React, { useCallback, useContext, useEffect, useState } from 'react'

export default function PaymentOptions({
    selectedPayment,
    isPaymentSelected,
    setSelectedPayment,
    tone = "dark",
}) {
    const { cart, storeData } = useContext(SiteContext);
    const t = useTranslations("payment");
    const [canApplyKokoOffer, setCanApplyKokoOffer] = useState(false);
    const [minusKokoOfferAmount, setMinusKokoOfferAmount] = useState(0);
    const [finalTotal, setFinalTotal] = useState(0);
    const [installmentAmount, setInstallmentAmount] = useState(0);
    const [subtotal, setSubtotal] = useState(0);
    const [standardDiscount, setStandardDiscount] = useState(0);
    const [shippingCost, setShippingCost] = useState(0);
    const [copied, setCopied] = useState(false);

    const accountNumber = '056010021580';

    const handleCopy = () => {
        navigator.clipboard.writeText(accountNumber);
        setCopied(true);

        // Reset the copied state after 2 seconds
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    useEffect(() => {
        if (!selectedPayment?.type && !selectedPayment?.status) {
            setSelectedPayment({
                type: "bankTransfer",
                status: true,
            });
        }
    }, [selectedPayment, setSelectedPayment]);



    const isGiftCardAvailable = cart?.some((d) => d.isGiftCard);
    const isHaveSalesItems = cart?.some((d) => (d.salePrice !== null && d.salePrice !== 0));
    const isLight = tone === "light";
    const optionClass = isLight
        ? "flex gap-2 items-center text-black p-2 border-[1px] border-black/10 rounded-3xl bg-white"
        : "flex gap-2 items-center text-white p-2 border-[1px] border-white/30 rounded-3xl bg-black/10";
    const activeOptionClass = isLight
        ? "flex gap-2 items-center text-black p-2 border-[1px] border-black/10 rounded-3xl bg-white"
        : "flex gap-2 items-center text-white p-2 border-[1px] border-white/30 rounded-3xl bg-black";
    const detailsClass = isLight
        ? "bg-white border-[1px] border-black/10 rounded-3xl p-4 text-xs space-y-2 text-black"
        : "bg-black backdrop-blur-sm border-[1px] border-white/15 rounded-3xl p-4 text-xs space-y-2";
    const helperTextClass = isLight ? "text-black/60" : "text-white/65";
    const helperLinkClass = isLight ? "underline text-black" : "underline text-white";
    const connectorClass = isLight ? "bg-black/20" : "bg-black";
    const switchClassName = isLight
        ? "border-black/20 data-[state=checked]:bg-black data-[state=unchecked]:bg-black/25"
        : "";
    const switchThumbClassName = isLight
        ? "bg-white data-[state=unchecked]:bg-white"
        : "";

    const calculateTotalAndInstallments = useCallback(() => {
        if (!cart || cart.length === 0) return;

        // Calculate subtotal
        const cartSubtotal = getCartTotal(cart);
        setSubtotal(cartSubtotal);

        // Calculate standard offer discount (before shipping)
        let discountAmount = 0;
        if (!isGiftCardAvailable && storeData?.offers?.enabledOffer && !isHaveSalesItems) {
            discountAmount = cartSubtotal * (storeData?.offers?.parentage / 100);
        }
        setStandardDiscount(discountAmount);

        // Calculate shipping cost
        const shipping = (cartSubtotal < 15000 && storeData?.fulfillmentType === 'delivery')
            ? storeData?.shipping?.flatRate
            : 0;
        setShippingCost(shipping);

        // Calculate total after standard discount and shipping
        let total = cartSubtotal - discountAmount + shipping;

        // Check for Koko offer if no standard offer was applied
        if (!storeData?.offers?.enabledOffer && storeData?.offers?.enabledKokoOffer && !isHaveSalesItems) {
            setCanApplyKokoOffer(true);

            // Calculate Koko discount amount (capped at 2500)
            const kokoDiscountAmount = total * (storeData?.offers?.kokoParentage / 100);
            const kokoDiscount = Math.min(kokoDiscountAmount, 2500);
            setMinusKokoOfferAmount(kokoDiscount);
            total = total - kokoDiscount;
        } else {
            setCanApplyKokoOffer(false);
            setMinusKokoOfferAmount(0);
        }

        // Set final total and calculate installments
        setFinalTotal(total);
        // Calculate installments based on the final total and round up
        setInstallmentAmount(total / 3);
    }, [cart, isGiftCardAvailable, isHaveSalesItems, storeData]);

    useEffect(() => {
        calculateTotalAndInstallments();
    }, [calculateTotalAndInstallments]);

    return (
        <div className={`flex flex-col p-5 xl:p-10 gap-3 ${isPaymentSelected !== null && isPaymentSelected === false ? "border-2 border-red-500" : ""}`}>
            {!isGiftCardAvailable && (
                <div className={optionClass}>
                    <div className="flex items-center space-x-2 font-headingFontMedium">
                        <CustomSwitch
                            id="cash-on-delivery"
                            className={switchClassName}
                            thumbClassName={switchThumbClassName}
                            checked={selectedPayment && selectedPayment?.type === "cod" && selectedPayment?.status}
                            onCheckedChange={() => setSelectedPayment(prev => ({
                                status: prev.type === 'cod' ? !prev.status : true,
                                type: 'cod'
                            }))}
                        />
                        <Label htmlFor="cash-on-delivery" className="font-headingFontMedium text-xs uppercase">{storeData?.fulfillmentType === 'delivery' ? t("cashOnDelivery") : t("cashAtPickup")}</Label>
                    </div>
                </div>
            )}

            {isGiftCardAvailable && storeData?.fulfillmentType !== 'delivery' && <>
                <div className={optionClass}>
                    <div className="flex items-center space-x-2 font-headingFontMedium">
                        <CustomSwitch id="cash-on-delivery"
                            className={switchClassName}
                            thumbClassName={switchThumbClassName}
                            checked={selectedPayment && selectedPayment?.type === "cod" && selectedPayment?.status}
                            onCheckedChange={() => setSelectedPayment(prev => ({
                                status: prev.type === 'cod' ? !prev.status : true,
                                type: 'cod'
                            }))}
                        />
                        <Label htmlFor="cash-on-delivery" className="font-headingFontMedium text-xs uppercase">{t("cashOnDelivery")}</Label>
                    </div>
                </div>
            </>}

            <div className='flex gap-2 flex-col'>
                <div className={optionClass}>
                    <div className="flex items-center space-x-2">
                        <CustomSwitch id="bankTransfer"
                            className={switchClassName}
                            thumbClassName={switchThumbClassName}
                            checked={selectedPayment && selectedPayment?.type === "bankTransfer" && selectedPayment?.status}
                            onCheckedChange={() => setSelectedPayment(prev => ({
                                status: prev.type === 'bankTransfer' ? !prev.status : true,
                                type: 'bankTransfer'
                            }))}
                        />
                        <Label htmlFor="bankTransfer" className="font-headingFontMedium text-xs uppercase">{t("bankTransfer")}</Label>
                    </div>
                </div>


                {selectedPayment && selectedPayment?.type === "bankTransfer" && selectedPayment?.status && <div className='flex flex-col gap-3 relative'>
                    <div className={`w-[1px] h-[10px] ${connectorClass} absolute -top-[10px] left-5`}></div>
                    <div className={detailsClass}>
                        <div className='flex items-center gap-2 font-headingFontMedium uppercase'>
                            <Banknote size={20} strokeWidth={1} />
                            {t("bankDetails")}
                        </div>

                        <div>
                            <div>{t("accountNumber")} : 056010021580</div>
                            <div>{t("bank")} : Hatton National Bank</div>
                            <div>{t("branch")} : Kiribathgoda</div>
                        </div>

                        <div className='flex justify-end'>
                            <button
                                onClick={handleCopy}
                                className='flex items-center gap-2 hover:underline transition-colors font-headingFontMedium uppercase text-[10px]'
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} strokeWidth={1} />
                                        {t("copied")}
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} strokeWidth={1} />
                                        {t("copyAccountNumber")}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className={`flex items-center text-[11px] gap-3 ${helperTextClass} justify-end`}>
                        <p>{t("bankTransferInstructions")} <Link href={'https://api.whatsapp.com/send/?phone=94718995566&text&type=phone_number&app_absent=0'} target='_blank' className={helperLinkClass}>+94 71 899 5566</Link></p>
                    </div>
                </div>}
            </div>


            {/* <div className='flex gap-2 flex-col'>
                <div className='flex gap-2 items-center text-white p-2 border-[1px] border-white/30 rounded-3xl bg-black/10'>
                    <div className="flex items-center space-x-2">
                        <CustomSwitch id="koko"
                            checked={selectedPayment && selectedPayment?.type === "koko" && selectedPayment?.status}
                            onCheckedChange={() => setSelectedPayment(prev => ({
                                status: prev.type === 'koko' ? !prev.status : true,
                                type: 'koko'
                            }))}
                        />
                        <Label htmlFor="koko" className="font-headingFontMedium text-xs uppercase">Koko: Buy Now Pay Later</Label>
                    </div>
                </div>

                {!isHaveSalesItems && canApplyKokoOffer && (
                    <>
                        <div className='bg-black p-3 text-white flex flex-row gap-3 justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <CirclePercent />
                                <div className='text-xs flex items-center gap-2'>
                                    <p>{storeData?.offers?.kokoParentage}%</p>
                                    <p>{storeData?.offers?.kokoOffersText}</p>
                                </div>
                            </div>
                            <div className='text-xs'>
                                - {formatPrice(minusKokoOfferAmount)}
                            </div>
                        </div>

                        <div className='flex gap-3 justify-between items-center'>
                            <div className='flex items-center gap-2'>
                                <div className='text-muted-foreground text-sm flex items-center gap-2'>
                                    <p>You will pay</p>
                                </div>
                            </div>
                            <div className='text-sm'>
                                {formatPrice(finalTotal)}
                            </div>
                        </div>
                    </>
                )}

                <div className='flex items-center text-[11px] gap-3 text-white/65 justify-end'>
                    <p>Pay in <span className='text-white'>3</span> installments of <span className='text-white'>{formatPrice(installmentAmount)}</span> with</p>
                    <Image unoptimized={true} src="/images/daraz-koko.png" className='w-[80px]' width={50} height={50} alt="" />
                </div>
            </div> */}

            {/* <div className='flex gap-2 flex-col '>
                <div className='flex gap-2 items-center text-white p-2 border-[1px] border-white/30 rounded-3xl bg-black/10'>
                    <div className="flex items-center space-x-2">
                        <CustomSwitch id="visa"
                            checked={selectedPayment && selectedPayment?.type === "visa" && selectedPayment?.status}
                            onCheckedChange={() => setSelectedPayment(prev => ({
                                status: prev.type === 'visa' ? !prev.status : true,
                                type: 'visa'
                            }))}
                        />
                        <Label htmlFor="visa" className="font-headingFontMedium text-xs uppercase">Visa / Mastercard</Label>
                    </div>
                </div>

                <div className='flex items-center text-sm text-muted-foreground justify-end gap-3'>
                    <Image unoptimized={true} src="/images/Visa-Logo-2006.png" className='w-[80px]' width={50} height={50} alt="" />
                </div>
            </div> */}
            {/* Stripe 支付选项 */}
            {storeData?.payments?.stripe && (
                <div className='flex gap-2 flex-col'>
                    <div className={activeOptionClass}>
                        <div className="flex items-center space-x-2">
                            <CustomSwitch id="stripe"
                                className={switchClassName}
                                thumbClassName={switchThumbClassName}
                                checked={selectedPayment?.type === "stripe" && selectedPayment?.status}
                                onCheckedChange={() => setSelectedPayment(prev => ({
                                    status: prev.type === 'stripe' ? !prev.status : true,
                                    type: 'stripe'
                                }))}
                            />
                            <Label htmlFor="stripe" className="font-headingFontMedium text-xs uppercase flex items-center">
                                {t("card")} &nbsp;&nbsp;<Image unoptimized src="/images/stripe-logo.png" alt="stripe" width={60} height={40} />
                            </Label>
                        </div>
                    </div>
                </div>
            )}
            {/* PayPal 支付选项 */}
            {storeData?.payments?.paypal && (
                <div className='flex gap-2 flex-col'>
                    <div className={activeOptionClass}>
                        <div className="flex items-center space-x-2">
                            <CustomSwitch id="paypal"
                                className={switchClassName}
                                thumbClassName={switchThumbClassName}
                                checked={selectedPayment?.type === "paypal" && selectedPayment?.status}
                                onCheckedChange={() => setSelectedPayment(prev => ({
                                    status: prev.type === 'paypal' ? !prev.status : true,
                                    type: 'paypal'
                                }))}
                            />
                            <Label htmlFor="paypal" className="font-headingFontMedium text-xs uppercase flex items-center">
                                {t("paypal")} &nbsp;&nbsp;<Image unoptimized src="/images/paypal-logo.svg" alt="paypal" width={60} height={40} />
                            </Label>
                        </div>
                    </div>
                </div>
            )}
            <div className='flex gap-2 flex-col '>
                {/* <div className='flex gap-2 items-center text-white p-2 border-[1px] border-white/30 rounded-3xl bg-black/10'>
                    <div className="flex items-center space-x-2">
                        <CustomSwitch id="payhere"
                            checked={selectedPayment && selectedPayment?.type === "payhere" && selectedPayment?.status}
                            onCheckedChange={() => setSelectedPayment(prev => ({
                                status: prev.type === 'payhere' ? !prev.status : true,
                                type: 'payhere'
                            }))}
                        />
                        <Label htmlFor="payhere" className="font-headingFontMedium text-xs uppercase flex items-center">Visa / Mastercard By <Image unoptimized={true} src="/images/PayHere-Logo.png" alt="payhere" width={60} height={40} /></Label>
                    </div>
                </div> */}

                <div className='flex items-center text-sm text-muted-foreground justify-end gap-3'>
                    {/* <Image unoptimized={true} src="/images/PayHere-Logo.png" className='w-[80px]' width={80} height={50} alt="" /> */}
                    {/* <Image unoptimized={true} src="/images/hnb.jpg" className='w-auto' width={50} height={50} alt="" /> */}
                </div>
            </div>
        </div>
    )
}
