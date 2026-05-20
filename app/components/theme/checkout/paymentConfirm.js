"use client";

import { AdminContext } from '@/app/contexts/adminContexts';
import { SiteContext } from '@/app/contexts/siteContexts';
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { apiReq, formatPrice } from '@/lib/common';
import { MonitorX, MoveLeft } from 'lucide-react'
import moment from 'moment';

import Image from 'next/image';
import Link from 'next/link';

import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useContext, useEffect, useState } from 'react';


export default function OrderConfirm() {

    const params = useSearchParams();
    const orderId = params.get('orderId');
    const router = useRouter();

    const [state, setState] = useState({
        isLoading: true,
        valid: true,
        orderData: {}
    });

    const [pickUpLocation, setPickupLocation] = useState('');

    const { removeAllFromCart, uniqueID, storeData, themeData, setStoreData } = useContext(SiteContext);

    const calculatedTotal = (total, sendType, fullData, themeData) => {
        const isGiftCardAvailable = fullData?.items?.some((d) => d.isGiftCard);
        const isHaveSalesItems = fullData?.items?.some((d) => (d.salePrice !== null && d.salePrice !== 0));
        

        let totalAmount;        
        
        if (fullData?.offersApplied && Object.keys(fullData?.typeOfOffer).length !== 0 && fullData?.typeOfOffer?.enabledOffer && !isGiftCardAvailable && !isHaveSalesItems) {
            const { parentage } = fullData?.typeOfOffer;
            
            totalAmount = total - (total * Number(parentage) / 100)
        } else{
            totalAmount = total;
        }

        if (sendType && sendType !== 'pickup') {
            return total > 15000 ? totalAmount : totalAmount + storeData?.shipping?.flatRate;
        } else {
            return totalAmount;
        }

    }

    const getOrderData = useCallback(async () => {
        const uniqueID = localStorage.getItem('uniqueID');

        if (!orderId || !uniqueID) {
            router.push('/shop');
            return;
        }

        try {
            setState(prev => ({ ...prev, isLoading: true }));

            // Single API call with all required parameters
            const response = await apiReq(`site/order?id=${orderId}&uniqueID=${uniqueID}`, 'GET');
            const resData = await response.json();

            if (!response.ok) {
                setState(prev => ({ ...prev, valid: false }));
                throw new Error(resData.message);
            }

            // Clear cart only after successful order fetch
            await removeAllFromCart(uniqueID);

            // Calculate total amount once
            const totalAmount = resData?.data?.items.reduce((total, item) =>
                total + ((item.salePrice || item.price) * item.quantity), 0);
            
            
            const finalTotal = calculatedTotal(totalAmount, resData?.data?.fulfillmentType, resData?.data, themeData);
            
            setState({
                isLoading: false,
                valid: true,
                orderData: {
                    ...resData?.data,
                    totalAmount: finalTotal,
                }
            });

            setStoreData((prevState) => ({
                ...prevState,
                fulfillmentType: 'delivery'
            }))

        } catch (error) {
            console.error('Error fetching order:', error);
            setState({
                isLoading: false,
                valid: false,
                orderData: {}
            });
        }
    }, [orderId, uniqueID, storeData?.shipping?.flatRate, removeAllFromCart, router, themeData]);



    useEffect(() => {
        getOrderData();
    }, []);


    useEffect(() => {
        const getAddress = themeData?.storeLocations?.locations?.find((d) => d.locationName === orderData.pickUpLocation);

        setPickupLocation(getAddress);

    }, [themeData, state]);

    const { isLoading, valid, orderData } = state;

    // console.log("test ====", orderData);
    

    return (
        <div>
            <div className='pt-[150px] relative text-center flex flex-col items-center gap-3'>
            </div>

            <div className='xl:max-w-[87vw] mx-auto my-5 min-h-[40vh] px-5'>
                {!valid ? <>
                    <div className='text-center space-y-3 mb-5 min-h-[30vh]'>
                        <MonitorX strokeWidth={0.58} className='w-40 h-40 mx-auto text-muted-foreground' />
                        <h3 className='text-xl font-bold'>This Order Has Expired!</h3>
                        <p>Please create a new order to continue.</p>
                    </div>
                </> : <>
                    <div className='flex items-center justify-center flex-col gap-3 mb-10 text-center p-5'>
                        {isLoading ? <Skeleton className="w-4/12 h-8" /> : <h1 className='text-3xl font-semibold mb-5'>Thank you for your order</h1>}


                        {isLoading ? <div className='flex flex-col gap-3 w-full items-center justify-center'>
                            <Skeleton className="w-8/12 h-3" />
                            <Skeleton className="w-5/12 h-3" />
                        </div> : <>
                            <p className='text-muted-foreground'>Thank you for your order! Your order has been successfully placed and is now being processed. You will receive an email shortly with the order details.</p>
                            <p className='text-muted-foreground'>Thank you for shopping with us!</p>
                        </>}
                    </div>

                    {isLoading ? <Skeleton className="w-full h-20 mb-4" /> :
                        <div className='border-[1px] p-5 bg-slate-50 mb-10'>
                            <div className="grid grid-cols-2 md:grid-cols-4 grid-flow-row gap-4">
                                <div className='flex flex-col gap-2'>
                                    <p className='uppercase text-sm text-muted-foreground'>Order Number</p>
                                    <p className="font-semibold">#{orderData?.customOrderId}</p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <p className='uppercase text-sm text-muted-foreground'>Date</p>
                                    <p className="font-semibold">{moment(orderData?.date).format('LLL')}</p>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <p className='uppercase text-sm text-muted-foreground'>Total</p>
                                    <p className="font-semibold">{formatPrice(orderData?.totalAmount)}</p>
                                    {/* {orderData?.offersApplied && <p className="text-xs text-muted-foreground">{orderData?.typeOfOffer?.enabledKokoOffer ? orderData?.typeOfOffer?.kokoOffersText  :  orderData?.typeOfOffer?.offersText} applied</p>} */}
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <p className='uppercase text-sm text-muted-foreground'>Payment</p>
                                    <p className="font-semibold uppercase">{orderData?.payment?.type}</p>
                                </div>
                            </div>
                        </div>}


                    <div className="mb-10 p-5 md:p-0">
                        {isLoading ? <>
                            <Skeleton className="w-4/12 h-6 mb-4" />
                            <Skeleton className="w-full h-[30vh] mb-4" />
                        </> : <>
                            <h1 className='text-xl font-semibold mb-5'>Order Items</h1>


                            <Table className="border-[1px]">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderData?.items?.map((d, i) => (
                                        <TableRow key={i.toString()}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Image unoptimized={true} src={d?.image} alt={d?.name || d?.title || "Order item image"} className='' width={100} height={100} />
                                                    <div className='flex flex-col gap-1'>
                                                        <div className='font-medium'>{d?.name || d?.title}</div>
                                                        <div className='flex items-center text-xs gap-4 text-muted-foreground'>
                                                            {d?.color && <div className='flex gap-1'>Color:<span className='block uppercase'>{d?.color}</span></div>}
                                                            {d?.size && <div className='flex gap-1'>Size:<span className='block uppercase'>{d?.size}</span></div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>{d?.quantity}</TableCell>
                                            <TableCell className="text-right">{formatPrice(d?.price * d.quantity)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </>}

                    </div>

                    {orderData?.fulfillmentType !== 'pickup' ? <div className="flex items-start w-full gap-5 p-5 md:p-0 flex-col md:flex-row">
                        <div className="mb-5 md:mb-10 w-full md:w-6/12">
                            {isLoading ? <Skeleton className="w-full h-[30vh]" /> : <>

                                <h1 className='text-xl font-semibold mb-5'>Billing Address</h1>

                                <div className='relative p-5 border-[1px] mb-5'>
                                    <div>
                                        <h3 className='uppercase text-sm text-muted-foreground mb-2'>Address</h3>
                                        <address className='not-italic mb-3 text-sm'>
                                            <div>{orderData?.billingAddress?.street && `${orderData?.billingAddress?.street}`}</div>
                                            <div>{orderData?.billingAddress?.addressLine2}</div>
                                            <div>{orderData?.billingAddress?.city}</div>
                                            {orderData?.billingAddress?.country}.
                                        </address>

                                        <h3 className='uppercase text-sm text-muted-foreground mb-2'>Contact</h3>
                                        <div className='flex flex-col text-sm'>
                                            <div>Email: {orderData?.billingAddress?.email}</div>
                                            {orderData?.billingAddress?.phone && <div>Phone: {orderData?.billingAddress?.phone}</div>}
                                        </div>
                                    </div>

                                </div>
                            </>}

                        </div>

                        <div className="mb-5 md:mb-10  w-full md:w-6/12">
                            {isLoading ? <Skeleton className="w-full h-[30vh]" /> : <>

                                <h1 className='text-xl font-semibold mb-5'>Shipping Address</h1>

                                <div className='relative p-5 border-[1px] mb-5'>
                                    {orderData?.shippingAddress && Object.keys(orderData?.shippingAddress).length !== 0 ?
                                        <div>
                                            <h3 className='uppercase text-sm text-muted-foreground mb-2'>Address</h3>
                                            <address className='not-italic mb-3 text-sm'>
                                                <div>{orderData?.shippingAddress?.street && `${orderData?.shippingAddress?.street}`}</div>
                                                <div>{orderData?.shippingAddress?.addressLine2}</div>
                                                <div>{orderData?.shippingAddress?.city}</div>
                                                {orderData?.shippingAddress?.country}.
                                            </address>

                                            <h3 className='uppercase text-sm text-muted-foreground mb-2'>Contact</h3>
                                            <div className='flex flex-col text-sm'>
                                                <div>Email: {orderData?.shippingAddress?.email}</div>
                                                {orderData?.shippingAddress?.phone && <div>Phone: {orderData?.shippingAddress?.phone}</div>}
                                            </div>
                                        </div>
                                        : <>
                                            <div className='text-sm'>Same as billing address</div>
                                        </>
                                    }
                                </div>
                            </>}

                        </div>

                    </div> : <div className='mb-8 block'>
                        <h1 className='text-xl font-semibold mb-5'>Pickup Order</h1>

                        <div className='border-[1px] p-3 space-y-3'>
                            <h4 className='font-semibold text-[16px]'>{pickUpLocation?.locationName}</h4>
                            <address className='not-italic text-sm'>
                                {pickUpLocation?.address}
                            </address>
                            <div className='flex flex-col gap-3'>
                                <Link className='text-sm' href={`tel:${pickUpLocation?.contactNumber}`}>{pickUpLocation?.contactNumber}</Link>
                                <Link className='text-sm' href={`mailto:${pickUpLocation?.emailAddress}`}>{pickUpLocation?.emailAddress}</Link>
                            </div>
                        </div>
                    </div>}
                </>}

                <div className="flex items-center justify-center mb-24">
                    <Button className="rounded-none flex items-center gap-2" onClick={() => router.push('/shop')}><MoveLeft />Continue Shopping</Button>
                </div>
            </div >
        </div >
    )
}
