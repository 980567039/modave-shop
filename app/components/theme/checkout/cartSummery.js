"use client";

import { SiteContext } from '@/app/contexts/siteContexts';
import useTotalOrderValue from '@/app/hooks/useTotalOrderValue';
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button';
import { formatPrice, getCartTotal } from '@/lib/common';
import { CirclePercent, Loader2, Trash } from 'lucide-react';
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'

export default function CartSummary({
    outOfStockItems,
    totalShippingCost
}) {
    const { cart, isLoading, storeData, removeFromCart } = useContext(SiteContext);
    const [subtotal, setSubtotal] = useState(0);
    const [total, setTotal] = useState(0);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [shouldShowShipping, setShouldShowShipping] = useState(true);

    const isGiftCardAvailable = cart?.some((d) => d.isGiftCard);
    const isHaveSalesItems = cart?.some((d) => (d.salePrice !== null && d.salePrice !== 0));

    const calculateTotals = () => {
        if (!cart) return;

        const cartSubtotal = getCartTotal(cart);
        setSubtotal(cartSubtotal);
        setShouldShowShipping(cartSubtotal < 15000);

        let discount = 0;
        let finalTotal = cartSubtotal;

        // Calculate discount if applicable
        if (!isGiftCardAvailable && storeData?.offers?.enabledOffer && !isHaveSalesItems) {
            discount = cartSubtotal * Number(storeData?.offers?.parentage) / 100;
            finalTotal = cartSubtotal - discount;
        }

        // Add shipping cost if applicable
        if (shouldShowShipping && storeData?.fulfillmentType !== 'pickup') {
            finalTotal += Number(storeData?.shipping?.flatRate);
        }

        setDiscountAmount(discount);
        setTotal(finalTotal);
    };

    useEffect(() => {
        calculateTotals();
        if (storeData && storeData?.fulfillmentType !== 'pickup' && cart && cart.length > 0 && shouldShowShipping) {
            totalShippingCost(storeData?.shipping?.flatRate);
        } else {
            totalShippingCost(0);
        }
    }, [cart, storeData, storeData?.offers, isGiftCardAvailable, isHaveSalesItems, shouldShowShipping]);

    return (
        <div>

            {isLoading && isLoading?.status && (
                <div className='p-5 flex items-center justify-center'>
                    <Loader2 className="h-8 w-8 animate-spin" strokeWidth={1} />
                </div>
            )}

            {cart && cart.length > 0 && cart.map((cartItem, index) => {
                const stockInfo = outOfStockItems?.insufficientItems?.find(
                    status =>
                        status.productId === cartItem.productId &&
                        status.size === cartItem.size &&
                        status.color === cartItem.color
                );

                const isOutOfStock = stockInfo ? !stockInfo.isStockSufficient : false;

                return (
                    <div className='flex gap-3 border-b-[1px] border-white/30 pb-3 mb-3 text-sm relative' key={index}>
                        <div className={`w-[150px] xl-w-[80px] rounded-xl overflow-hidden relative ${isOutOfStock ? 'opacity-50' : ''}`}>
                            <Image
                                src={cartItem?.image}
                                alt={cartItem?.name || cartItem?.title || "Cart item image"}
                                width={150}
                                height={150}
                                className="w-full object-cover"
                                unoptimized={true}
                            />
                        </div>

                        <div className='w-[calc(100%-150px)] xl:w-[calc(100%-80px)] flex flex-col justify-center'>
                            {cartItem?.sku && <div className='text-[10px] font-light'>Code: <span className='font-semibold'>{cartItem?.sku}</span></div>}
                            <div className={`flex flex-col ${isOutOfStock ? 'opacity-50' : ''}`}>
                                <h3 className='capitalize truncate'>{cartItem?.name}</h3>
                                <div className='flex items-center gap-2 text-white/55'>
                                    {cartItem?.size && <div className='text-[10px]'>Size: <span className='capitalize'>{cartItem?.size?.replace('-', ' ')}</span></div>}
                                    {cartItem?.color && <div className='text-[10px]'>Color: <span className='capitalize'>{cartItem?.color?.replace('-', ' ')}</span></div>}
                                </div>
                                <div>{cartItem?.quantity && <div className="text-white/60 text-xs">x {cartItem?.quantity}</div>}</div>
                            </div>
                            <div className={`mt-3 ${isOutOfStock ? 'opacity-50' : ''}`}>
                                <h3>{formatPrice(Number(cartItem?.price * cartItem?.quantity))}</h3>
                            </div>
                            {isOutOfStock && (
                                <div className='text-red-500 font-semibold z-40 text-xs pr-4'>
                                    Out Of Stock
                                </div>
                            )}
                        </div>
                        <Button onClick={() => removeFromCart(cartItem)} variant="ghost" size="sm" className="hover:bg-white/30 hover:text-red-500"><Trash size={12} /></Button>
                    </div>
                )
            })}

            {cart && cart.length > 0 && (
                <div className='flex gap-2 py-3 border-b-[1px] border-white/30 w-full justify-between text-sm'>
                    <div className='uppercase font-headingFontMedium'>Subtotal</div>
                    <div className='text-right'>{formatPrice(subtotal)}</div>
                </div>
            )}

            {!isGiftCardAvailable && storeData?.offers?.enabledOffer && !isHaveSalesItems && discountAmount > 0 && (
                <div className='flex gap-2 py-3 bg-black text-white px-2 w-full justify-between text-sm my-2'>
                    <div className='flex items-center gap-3 justify-start'>
                        <CirclePercent />
                        <div className='capitalize'>{storeData?.offers?.offersText}</div>
                    </div>
                    <div className='text-right'>- {formatPrice(discountAmount)} ({storeData?.offers?.parentage}%)</div>
                </div>
            )}

            {storeData && storeData?.fulfillmentType !== 'pickup' && cart && cart.length > 0 && shouldShowShipping && (
                <div className='py-3 border-b-[1px] border-white/30 w-full text-sm flex flex-col gap-2'>
                    <div className='uppercase font-headingFontMedium'>Shipping</div>
                    <div className='flex gap-2 justify-between items-center'>
                        <div className='font-headingFontMedium uppercase'>Flat rate:</div>
                        <div className='text-right'>Rs: {storeData?.shipping?.flatRate}</div>
                    </div>
                </div>
            )}

            {cart && cart.length > 0 && (
                <div className='flex gap-2 py-3 border-b-[1px] border-white/30 w-full justify-between text-sm mb-5'>
                    <div className='uppercase font-headingFontMedium'>Total</div>
                    <div className='text-right font-bold'>{formatPrice(total)}</div>
                </div>
            )}
        </div>
    )
}
