import { SiteContext } from '@/app/contexts/siteContexts';
import { CustomSwitch } from '@/components/ui/front-switch';
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { formatPrice, getCartTotal } from '@/lib/common';
import { Banknote, Check, CirclePercent, Copy } from 'lucide-react';
import Image from 'next/image'
import Link from 'next/link';
import React, { useCallback, useContext, useEffect, useState } from 'react'

export default function PaymentOptions({
    selectedPayment,
    isPaymentSelected,
    setSelectedPayment,
}) {
    const { cart, storeData } = useContext(SiteContext);
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
                <div className='flex gap-2 items-center text-white p-2 border-[1px] border-white/30 rounded-3xl bg-black/10'>
                    <div className="flex items-center space-x-2 font-headingFontMedium">
                        <CustomSwitch
                            id="cash-on-delivery"
                            checked={selectedPayment && selectedPayment?.type === "cod" && selectedPayment?.status}
                            onCheckedChange={() => setSelectedPayment(prev => ({
                                status: prev.type === 'cod' ? !prev.status : true,
                                type: 'cod'
                            }))}
                        />
                        <Label htmlFor="cash-on-delivery" className="font-headingFontMedium text-xs uppercase">{storeData?.fulfillmentType === 'delivery' ? 'Cash on delivery' : 'Cash at pickup'}</Label>
                    </div>
                </div>
            )}

            {isGiftCardAvailable && storeData?.fulfillmentType !== 'delivery' && <>
                <div className='flex gap-2 items-center text-white p-2 border-[1px] border-white/30 rounded-3xl bg-black/10'>
                    <div className="flex items-center space-x-2 font-headingFontMedium">
                        <CustomSwitch id="cash-on-delivery"
                            checked={selectedPayment && selectedPayment?.type === "cod" && selectedPayment?.status}
                            onCheckedChange={() => setSelectedPayment(prev => ({
                                status: prev.type === 'cod' ? !prev.status : true,
                                type: 'cod'
                            }))}
                        />
                        <Label htmlFor="cash-on-delivery" className="font-headingFontMedium text-xs uppercase">Cash on delivery</Label>
                    </div>
                </div>
            </>}

            <div className='flex gap-2 flex-col'>
                <div className='flex gap-2 items-center text-white p-2 border-[1px] border-white/30 rounded-3xl bg-black/10'>
                    <div className="flex items-center space-x-2">
                        <CustomSwitch id="bankTransfer"
                            checked={selectedPayment && selectedPayment?.type === "bankTransfer" && selectedPayment?.status}
                            onCheckedChange={() => setSelectedPayment(prev => ({
                                status: prev.type === 'bankTransfer' ? !prev.status : true,
                                type: 'bankTransfer'
                            }))}
                        />
                        <Label htmlFor="bankTransfer" className="font-headingFontMedium text-xs uppercase">Bank Transfer</Label>
                    </div>
                </div>


                {selectedPayment && selectedPayment?.type === "bankTransfer" && selectedPayment?.status && <div className='flex flex-col gap-3 relative'>
                    <div className='w-[1px] h-[10px] bg-black absolute -top-[10px] left-5'></div>
                    <div className='bg-black backdrop-blur-sm border-[1px] border-white/15 rounded-3xl p-4 text-xs space-y-2'>
                        <div className='flex items-center gap-2 font-headingFontMedium uppercase'>
                            <Banknote size={20} strokeWidth={1} />
                            Bank Details
                        </div>

                        <div>
                            <div>Account number : 056010021580</div>
                            <div>Bank : Hatton National Bank</div>
                            <div>Branch : Kiribathgoda</div>
                        </div>

                        <div className='flex justify-end'>
                            <button
                                onClick={handleCopy}
                                className='flex items-center gap-2 hover:underline transition-colors font-headingFontMedium uppercase text-[10px]'
                            >
                                {copied ? (
                                    <>
                                        <Check size={16} strokeWidth={1} />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={16} strokeWidth={1} />
                                        Copy Account Number
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className='flex items-center text-[11px] gap-3 text-white/65 justify-end'>
                        <p>Make your payment directly into our bank account. Please use your Order Number as the payment reference. Your order will not be shipped until the funds have cleared in our account. Send us the payment slip/ receipt via WhatsApp : <Link href={'https://api.whatsapp.com/send/?phone=94718995566&text&type=phone_number&app_absent=0'} target='_blank' className='underline text-white'>+94 71 899 5566</Link></p>
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
                    <div className='flex gap-2 items-center text-white p-2 border-[1px] border-white/30 rounded-3xl bg-black'>
                        <div className="flex items-center space-x-2">
                            <CustomSwitch id="stripe"
                                checked={selectedPayment?.type === "stripe" && selectedPayment?.status}
                                onCheckedChange={() => setSelectedPayment(prev => ({
                                    status: prev.type === 'stripe' ? !prev.status : true,
                                    type: 'stripe'
                                }))}
                            />
                            <Label htmlFor="stripe" className="font-headingFontMedium text-xs uppercase flex items-center">
                                Visa / Mastercard &nbsp;&nbsp;<Image unoptimized src="/images/stripe-logo.png" alt="stripe" width={60} height={40} />
                            </Label>
                        </div>
                    </div>
                </div>
            )}
            {/* PayPal 支付选项 */}
            {storeData?.payments?.paypal && (
                <div className='flex gap-2 flex-col'>
                    <div className='flex gap-2 items-center text-white p-2 border-[1px] border-white/30 rounded-3xl bg-black'>
                        <div className="flex items-center space-x-2">
                            <CustomSwitch id="paypal"
                                checked={selectedPayment?.type === "paypal" && selectedPayment?.status}
                                onCheckedChange={() => setSelectedPayment(prev => ({
                                    status: prev.type === 'paypal' ? !prev.status : true,
                                    type: 'paypal'
                                }))}
                            />
                            <Label htmlFor="paypal" className="font-headingFontMedium text-xs uppercase flex items-center">
                                PayPal &nbsp;&nbsp;<Image unoptimized src="/images/paypal-logo.svg" alt="paypal" width={60} height={40} />
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
