import { Button } from '@/components/ui/button'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { AlertCircle, Loader2, ShoppingCart, Truck, User2 } from 'lucide-react'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import CartRow from '../cart/cartRow'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import { SiteContext } from '@/app/contexts/siteContexts'
import { Badge } from '@/components/ui/badge'
import { checkStock, formatPrice, getCartTotal } from '@/lib/common'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { IconCart, IconUser } from '../../svgIcons'
import useMediaQuery from '@/app/hooks/useMediaQuery'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import CartContent from './cartContent'

export default function CartButton({
    isScroll,
    cartItems
}) {
    const { cart, isLoading, openCartModal, setOpenCartModal, removeFromCart, storeData } = useContext(SiteContext);
    const [openSheet, setOpenSheet] = useState(false);
    const [outOfStock, setOutOfStock] = useState({});
    const [showConfirmMessage, setShowConfirmMessage] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [offerPrice, setOfferPrice] = useState('');


    const router = useRouter();
    const isDesktop = useMediaQuery("(min-width: 768px)")

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

    const handlerCheckout = async () => {
        const checkItemsStock = await checkStock(cart);
        setOutOfStock(checkItemsStock || {});



        if (checkItemsStock && checkItemsStock?.res?.status === 400) {
            setShowConfirmMessage(true);
        } else {
            setOpenSheet(false);
            router.push('/checkout');
        }

    }


    const confirmRemoveItems = () => {
        if (!outOfStock?.insufficientItems || !cart) return;

        const outOfStockProductIds = outOfStock.insufficientItems
            .filter(d => !d.isStockSufficient)
            .map(d => d.productId);

        const outOfStockCartItems = cart.filter(d =>
            outOfStockProductIds.includes(d.productId)
        );

        if (outOfStockCartItems && outOfStockCartItems.length > 0) {
            setConfirmLoading(true);
            outOfStockCartItems.map((product) => {
                removeFromCart(product);
            })

            setOutOfStock({});
            setConfirmLoading(false);
            setShowConfirmMessage(false);

            if (cart && cart?.length > 0) {
                setOpenSheet(false);
            }
        }
    }

    const whenOpenCheck = async () => {
        const respond = await checkStock(cart);

        if (respond && respond?.res?.status === 400) {
            setOutOfStock({
                ...respond,
            } || {});
        }
    }

    useEffect(() => {
        setOpenSheet(openCartModal);
    }, [openCartModal])

    useEffect(() => {

        if (openSheet) {
            whenOpenCheck()
        }

    }, [openSheet]);

    useEffect(() => {
        if (storeData?.offers?.enabledOffer) {
            const discount = getCartTotal(cart) * Number(storeData?.offers?.parentage) / 100;
            setOfferPrice(discount);

        }
    }, [storeData?.offers, cart])



    return (
        <div>
            {isDesktop ? <>
                <DropdownMenu open={openSheet} onOpenChange={() => {
                    setOpenSheet(false);
                    setOpenCartModal(false);
                }}>
                    <DropdownMenuTrigger
                        className=""
                        aria-label="Dropdown menu"
                        asChild={true}
                    >
                        <Button className='w-12 h-12 rounded-full p-1 transition-all ease-in-out delay-75 hover:border-white/60 hover:bg-transparent flex items-center justify-center border-[1px] border-white/50' variant="ghost" onClick={() => setOpenSheet(true)} aria-label="Cart">
                            <IconCart
                                fill="#fff"
                                style={{
                                    width: 14,
                                    height: 14
                                }}
                            />
                            {cartItems && cartItems.length > 0 && <Badge className="absolute top-2 px-2 right-3 text-xs" variant="destructive">{cartItems.length}</Badge>}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="rounded-3xl border-0 backdrop-blur-xl p-8 min-w-[600px] bg-black/80 text-white top-10" side="bottom" align="end" >
                        <CartContent 
                            isLoading={isLoading}
                            cart={cart}
                            cartItems={cartItems}
                            storeData={storeData}
                            outOfStock={outOfStock}
                            setOpenSheet={(d) => setOpenSheet(d)}
                            setOpenCartModal={(d) => setOpenCartModal(d)}
                            handlerCheckout={handlerCheckout}
                        />
                    </DropdownMenuContent>
                </DropdownMenu>
            </> : <Sheet open={openSheet} onOpenChange={() => {
                setOpenSheet(false);
                setOpenCartModal(false);
            }}>
                <Button className='w-12 h-12 rounded-full p-1 transition-all ease-in-out delay-75 hover:border-white/60 hover:bg-transparent flex items-center justify-center border-[1px] border-white/50' variant="ghost" onClick={() => setOpenSheet(true)} aria-label="Cart">
                    <IconCart
                        fill="#fff"
                        style={{
                            width: 14,
                            height: 14
                        }}
                    />
                    {cartItems && cartItems.length > 0 && <Badge className="absolute -top-1 -right-1 text-xs" variant="destructive">{cartItems.length}</Badge>}
                </Button>

                <SheetContent className="min-w-[95%] lg:min-w-[40%]">
                    <div className='flex flex-col h-full'>

                        <div className='flex gap-3 items-center'>
                            <div className='flex items-center justify-center border-[1px] rounded-full p-2'>
                                <ShoppingCart className='w-4 h-4' />
                            </div>
                            <h3 className='text-2xl font-bold font-headingFontMedium'>Shopping Cart</h3>
                        </div>


                        {cartItems && cartItems.length > 0 && <> <div className='py-2 mt-3'>
                            <div className='relative w-full mb-5'>
                                <Progress value={calculateDelivery()} className="h-[10px] transition-all ease-in-out" />
                                <div
                                    className={`w-7 h-7 rounded-full bg-white flex items-center justify-center absolute -top-2.5 border-[1px] border-black transition-all ease-in-out`}
                                    style={{
                                        left: `calc(${calculateDelivery()}% - 5px)`
                                    }}>
                                    <Truck className='w-4 h-4' />
                                </div>
                            </div>
                            <p className='text-muted-foreground text-xs'>Free shipping for all orders over Rs 15,000!</p>

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

                        <div className='h-[calc(100%-150px)] py-5 overflow-y-auto flex flex-col gap-3'>
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
                                        />
                                    );
                                })
                            ) : (
                                <div className="flex items-center justify-center flex-col h-full space-y-5">
                                    <Image
                                        src="/images/empty-cart.svg"
                                        alt="empty cart"
                                        width={300}
                                        height={300}
                                        unoptimized={true}
                                    />
                                    <p className="text-muted-foreground">No Cart Items</p>
                                    <Button
                                        className="rounded-3xl"
                                        onClick={() => {
                                            router.push('/shop');
                                            setOpenSheet(false);
                                            setOpenCartModal(false);
                                        }}
                                    >
                                        Shop Now
                                    </Button>
                                </div>
                            )}

                        </div>
                        {cartItems && cartItems.length > 0 && <div className=''>
                            <div className='flex items-center justify-between py-3 text-sm lg:text-xl'>
                                <label>Subtotal</label>
                                <div className='font-bold'>{formatPrice(getCartTotal(cart))}</div>
                            </div>

                            <div className='flex gap-5 lg:flex-row'>
                                <Button disabled={isLoading?.status} className='w-full h-[50px] border-black rounded-3xl font-headingFontMedium uppercase' variant="outline" onClick={() => {
                                    setOpenSheet(false)
                                    router.push('/cart');
                                }}>View Cart </Button>
                                <Button disabled={isLoading?.status} className='w-full rounded-3xl h-[50px] font-headingFontMedium uppercase' onClick={handlerCheckout}>Checkout</Button>
                            </div>
                        </div>}
                    </div>
                </SheetContent>
            </Sheet>}




            <AlertDialog open={showConfirmMessage} onOpenChange={() => setOpenCartModal(false)} className="rounded-3xl">

                <AlertDialogContent className="rounded-3xl border-none" style={{
                    borderRadius: 30
                }}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmation Required!</AlertDialogTitle>
                        <AlertDialogDescription>
                            Some items in your cart are out of stock. Would you like to proceed by removing them?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-3xl" onClick={() => setShowConfirmMessage(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRemoveItems} className="rounded-3xl" disabled={confirmLoading}>{confirmLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
