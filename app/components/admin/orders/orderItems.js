"use client";
import { AdminContext } from '@/app/contexts/adminContexts';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatPrice } from '@/lib/common';
import { X } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';

export default function OrderItems({ data, fullOrder }) {
    const [items, setItems] = useState(data || []);
    const [totalOrderValue, setTotalOrderValue] = useState(0);
    const [reduceForKoko, setReduceForKoko] = useState(0);

    const { store } = useContext(AdminContext);
    const isGiftCardAvailable = items?.some((d) => d.isGiftCard);

    const totalAmount = items.reduce((total, item) => {
        return total + (Number(item.salesPrice || item.price) * item.quantity);
    }, 0);

    useEffect(() => {
        let totalValue;
        const isOffersApplied = fullOrder?.offersApplied;
        // const isEnabledKokoOffer = true;
        const isEnabledKokoOffer = fullOrder?.typeOfOffer?.enabledKokoOffer;

        let offerValue;

        if(fullOrder?.offersApplied && fullOrder?.typeOfOffer?.enabledOffer &&  fullOrder?.payment?.type !== "koko"){
            offerValue = fullOrder?.typeOfOffer?.enabledOffer ? totalAmount - totalAmount * Number(fullOrder?.typeOfOffer?.parentage) / 100 : 0;
            
        
        } else if(fullOrder?.offersApplied && isEnabledKokoOffer &&  fullOrder?.payment?.type === "koko"){
            const getOrderFullValue = totalAmount <=  15000 ? totalAmount + (fullOrder?.fulfillmentType !== 'pickup' ? store?.shipping?.flatRate  : 0) : totalAmount;
            
            setReduceForKoko(getOrderFullValue);
            // offerValue = isEnabledKokoOffer ? getOrderFullValue  : 0;
        }
        
        if (fullOrder && fullOrder?.fulfillmentType === 'pickup') {
            totalValue = isOffersApplied ? offerValue : totalAmount
        } else {
            if(isEnabledKokoOffer){
                offerValue = totalAmount
            }
            
            totalValue = totalAmount <= 15000 ? (isOffersApplied ? offerValue : totalAmount) + store?.shipping?.flatRate : totalAmount
        }
        
        
        

        setTotalOrderValue(totalValue)
    }, [fullOrder, store]);

    useEffect(() => {
        setItems(data)
    }, [data]);

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[400px]">产品</TableHead>
                        <TableHead>数量</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead className="text-right">金额</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item, i) => (
                        <TableRow key={i.toString()}>
                            <TableCell className="font-medium">
                                <div className='flex gap-2 items-center'>
                                    <img src={item.image} alt={item.name} width={40} height={40} className='w-[50px] h-auto rounded-xl' />
                                    <div className='flex flex-col'>
                                        <span>{item.name}</span>
                                        <div className='flex items-center gap-3 text-xs text-muted-foreground'>
                                            {item?.color && <div>颜色 : {item?.color}</div>}
                                            {item?.size && <div>尺寸 : {item?.size}</div>}
                                        </div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell><div className='flex items-center gap-1'>{item.quantity} <X className='w-4 h-4 text-muted-foreground' />件{item.quantity > 1 ? '' : ''}</div></TableCell>
                            <TableCell><div className='flex items-center gap-1'>{item.sku || '-'}</div></TableCell>
                            <TableCell className="text-right">{formatPrice(item.price * item.quantity)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    {!isGiftCardAvailable && fullOrder?.offersApplied && fullOrder?.typeOfOffer?.enabledOffer && !(fullOrder?.typeOfOffer?.enabledKokoOffer && fullOrder?.payment?.type === "koko") && <TableRow className="font-normal bg-red-50">
                        <TableCell colSpan={3}>
                            <div className='flex flex-col'>
                                <p>已应用优惠</p>
                                <p className='text-xs text-muted-foreground'>{fullOrder?.typeOfOffer?.offersText} {fullOrder?.typeOfOffer?.parentage}% 已应用</p>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">-{formatPrice(totalAmount * Number(fullOrder?.typeOfOffer?.parentage) / 100)}</TableCell>
                    </TableRow>}

                    {fullOrder?.fulfillmentType === 'delivery' && <TableRow className="font-normal border-b-[1px]">
                        <TableCell colSpan={3}>运费</TableCell>
                        <TableCell className="text-right">{formatPrice(totalAmount <= 15000 ? store?.shipping?.flatRate : 0)}</TableCell>
                    </TableRow>}


                    { fullOrder?.payment?.type === "koko" && fullOrder?.payment?.enabledKokoOffer && <TableRow >
                        <TableCell colSpan={3} className="font-normal border-top-[2px]">
                            <div className='flex flex-col gap-2'>
                                <div className="flex items-center gap-1">
                                    <img src="/images/daraz-koko.png" alt="KOKO支付" width={50} height={50}/>
                                    <span>已应用优惠</span>
                                </div>
                                <p className='text-xs text-muted-foreground'>{fullOrder?.typeOfOffer?.kokoOffersText} - {fullOrder?.typeOfOffer?.kokoParentage}% 已应用</p>
                            </div>
                        </TableCell>
                        <TableCell className="text-right border-top-[2px]">- {formatPrice((reduceForKoko * fullOrder?.typeOfOffer?.kokoParentage / 100) < 2500 ? reduceForKoko * fullOrder?.typeOfOffer?.kokoParentage / 100 : 2500)}</TableCell>
                    </TableRow>}

                    <TableRow>
                        <TableCell colSpan={3}>总计</TableCell>
                        <TableCell className="text-right">{formatPrice(fullOrder?.paymentId?.amount)}</TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}
