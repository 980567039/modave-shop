import React from 'react'
import { IconCart } from '../../svgIcons';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, ChevronLeft, Truck } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import CartRow from '../cart/cartRow';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatPrice, getCartTotal } from '@/lib/common';

export default function CartContent({ cartItems, storeData, outOfStock, setOpenSheet, setOpenCartModal, cart, isLoading, handlerCheckout }) {
    const router = useRouter();

    const calculateDelivery = () => {
        if (cartItems && cartItems.length > 0) {
            const cartTotal = getCartTotal(cart);
            if (cartTotal > 15000) {
                return 100;
            } else {
                return cartTotal / 15000 * 100;
            }
        }
    }

    return (
        <div className='flex flex-col h-full'>

            <div className='flex gap-3 items-center'>
                <div className='flex items-center justify-center '>
                    <IconCart fill="#fff"
                        style={{
                            width: 20,
                            height: 20
                        }} />
                </div>
                <h3 className='text-base uppercase  tracking-[1.1px] font-headingFontMedium'>Shopping Cart </h3>
            </div>


            {cartItems && cartItems.length > 0 && <> <div className='py-2 mt-3'>
                <div className='relative w-full mb-5'>
                    <Progress value={calculateDelivery()} className="h-[5px] transition-all ease-in-out rounded-3xl" />
                    <div
                        className={`w-4 h-4 rounded-full bg-white flex items-center justify-center absolute -top-1.5 transition-all ease-in-out`}
                        style={{
                            left: `calc(${calculateDelivery()}% - 5px)`
                        }}>
                        <Truck className='w-4 h-4' />
                    </div>
                </div>
                <p className='text-white/70 text-xs'>Free shipping for all orders over Rs 15,000!</p>

                {storeData?.offers?.enabledOffer && <div className='flex items-center justify-between py-3 text-xs mt-5  bg-black text-white px-5'>
                    <div>{storeData?.offers?.parentage}% Off On Checkout</div>
                </div>}
            </div>
            </>}

            {outOfStock && outOfStock?.res?.showMessage && <Alert variant="destructive" className="mb-3 rounded-none text-xs">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Insufficient stock for some items</AlertTitle>
                <AlertDescription className="text-xs">
                    We&apos;re sorry, but some items in your cart are currently out of stock or have insufficient quantities available. Please adjust your order accordingly.
                </AlertDescription>
            </Alert>}

            <div className='h-[calc(100%-350px)] overflow-auto py-5 overflow-y-auto flex flex-col gap-3'>
                <div className="h-[40vh] overflow-y-auto">
                    {cartItems && cartItems.length > 0 ? (
                        cartItems.map((item, index) => {
                            const stockInfo = outOfStock?.insufficientItems?.find(
                                status =>
                                    status.productId === item.productId &&
                                    status.size === item.size &&
                                    status.color === item.color
                            );

                            const isOutOfStock = stockInfo ? !stockInfo.isStockSufficient : false;

                            return (
                                <CartRow
                                    data={item}
                                    key={item.randomKey || index}
                                    className={isOutOfStock ? "opacity-50" : ""}
                                    isOutOfStock={isOutOfStock}
                                    popupCartRow={true}
                                />
                            );
                        })
                    ) : (
                        <div className="flex items-center justify-center flex-col h-full space-y-5">
                            <Image
                                src="/images/empty-cart-2.svg"
                                alt="empty cart"
                                width={300}
                                height={300}
                                unoptimized={true}
                            />
                            <p className="text-white/65">No Cart Items</p>
                            <Button className="rounded-full flex items-center gap-2 font-headingFontMedium uppercase" onClick={() => router.push('/shop')}><ChevronLeft />Continue Shopping</Button>
                        </div>
                    )}
                </div>

            </div>
            {cartItems && cartItems.length > 0 && <div className=''>
                <div className='flex items-center justify-between py-3 text-sm uppercase'>
                    <label className='tracking-wider'>Subtotal</label>
                    <div className='font-bold'>{formatPrice(getCartTotal(cart))}</div>
                </div>

                <div className='flex gap-5 flex-col lg:flex-row'>
                    <Button disabled={isLoading?.status}  className='w-full rounded-full h-[50px] bg-transparent border-white/35 uppercase text-xs tracking-wider hover:bg-transparent hover:border-white/60 hover:text-white' variant="outline" onClick={() => {
                        setOpenSheet(false)
                        router.push('/cart');
                    }}>View Cart </Button>

                    <Button disabled={isLoading?.status} className='w-full rounded-full h-[50px] bg-white text-black uppercase text-xs tracking-wider hover:bg-black hover:text-white border-[1px] border-transparent hover:border-white' onClick={handlerCheckout}>Checkout</Button>
                </div>
            </div>}
        </div>
    )
}
