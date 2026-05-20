"use client";

import React, { useState, useRef, useEffect, useContext } from 'react'
import { IconInvoice } from '../../svgIcons'
import { Button } from '@/components/ui/button'
import { Download, DownloadIcon } from 'lucide-react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import Invoice from '../invoice-templates/invoice';
import IsolatedPrintableComponent from './IsolatedPrintableComponent';
import { object } from 'zod';
import { formatPrice } from '@/lib/common';
import { AdminContext } from '@/app/contexts/adminContexts';
import moment from 'moment';

export default function CustomerInvoice({
    data,
    orderNote
}) {
    const [openSheet, setOpenSheet] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [invoiceData, setInvoiceData] = useState({});
    const [reduceForKoko, setReduceForKoko] = useState(0);

    const invoiceRef = useRef(null);

   

    const { store } = useContext(AdminContext);

    const [html2pdf, setHtml2pdf] = useState(null);

    const handleDownload = async () => {
        if (!html2pdf) {
            console.error('html2pdf is not loaded yet');
            return;
        }

        setIsLoading(true);
        try {
            const element = invoiceRef.current;

            // Convert Next.js Image components to regular img tags
            const images = element.getElementsByTagName('img');
            for (let img of images) {
                if (img.srcset) {
                    // This is likely a Next.js Image component
                    img.src = img.src;
                    img.removeAttribute('srcset');
                    img.removeAttribute('sizes');
                }
            }

            const opt = {
                margin: 10,
                filename: `invoice_${invoiceData.invoiceNo}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: true
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            html2pdf().from(element).set(opt).save();
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
        setIsLoading(false);
    };

    const calculateSubtotal = (items) => {
        return items.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
    };

    const getShippingAddress = (fData) => {
        const { billingAddress, shippingAddress } = fData;

        // Check if shipping address is filled
        const isShippingAddressFilled = shippingAddress &&
            Object.values(shippingAddress).some(value =>
                value !== null && value !== undefined && value !== '');

        // Return shipping address if filled, otherwise return billing address
        return isShippingAddressFilled ? shippingAddress : billingAddress;
    }

    useEffect(() => {

        if (data && Object.keys(data).length !== 0) {

           

            const subtotal = calculateSubtotal(data.items);
            const flatRate = store?.shipping?.flatRate;
            const shippingCharge = data?.fulfillmentType === 'delivery' ? (subtotal > 15000 ? 0 : flatRate) : 0;

            let receiveDetails = {
                name: `${data.billingAddress.firstName} ${data.billingAddress.lastName}`,
                mobile: data.billingAddress.phone
            };

            const totalAmount = data?.items.reduce((total, item) => {
                return total + (Number(item.salesPrice || item.price) * item.quantity);
            }, 0);

            const shippingAddress = getShippingAddress(data)

            let totalValue;
            const isOffersApplied = data?.offersApplied;
            // const isEnabledKokoOffer = true;
            const isEnabledKokoOffer = data?.typeOfOffer?.enabledKokoOffer;

            let offerValue;
            let kokoReduceAmount;


            if (data?.offersApplied && data?.typeOfOffer?.enabledOffer && data?.payment?.type !== "koko") {
                offerValue = data?.typeOfOffer?.enabledOffer ? totalAmount - totalAmount * Number(data?.typeOfOffer?.parentage) / 100 : 0;


            } else if (data?.offersApplied && isEnabledKokoOffer && data?.payment?.type === "koko") {
                const getOrderFullValue = totalAmount < 15000 ? totalAmount + store?.shipping?.flatRate : totalAmount;

                kokoReduceAmount = getOrderFullValue;

                setReduceForKoko(getOrderFullValue);
                // offerValue = isEnabledKokoOffer ? getOrderFullValue  : 0;
            }

            if (data && data?.fulfillmentType === 'pickup') {
                totalValue = isOffersApplied ? offerValue : totalAmount
            } else {

                if (isEnabledKokoOffer) {
                    offerValue = totalAmount
                }

                totalValue = totalAmount <= 15000 ? (isOffersApplied ? offerValue : totalAmount) + store?.shipping?.flatRate : totalAmount
            }


            if (data?.fulfillmentType !== 'delivery' && store) {
                const getPickupLocation = store?.theme?.storeLocations?.locations?.find((d) => d.locationName === data?.pickUpLocation);

                receiveDetails.location = getPickupLocation?.locationName || ''
                receiveDetails.locationAddress = getPickupLocation?.address || ''
                receiveDetails.locationEmail = getPickupLocation?.emailAddress || ''
                receiveDetails.locationContactNumber = getPickupLocation?.contactNumber || ''
            }

            let percentage = '0';


            if (data?.typeOfOffer?.enabledOffer) {
                percentage = `${data?.typeOfOffer?.parentage}% 折扣`
            } else if (data?.typeOfOffer?.enabledKokoOffer) {
                percentage = `${data?.typeOfOffer?.kokoParentage}% 折扣`
            }
    

            setInvoiceData({
                invoiceNo: `#${data.customOrderId.replace('ORD', 'UP')}`,
                orderNo: `#${data.customOrderId}`,
                orderDate: moment(data.date).format('DD/MM/YYYY HH:mm'),
                fulfillmentType: data?.fulfillmentType,
                orderNote: orderNote || '',
                shipper: {
                    name: 'Nuvie',
                    address: '#2nd Floor, Liberty Plaza, NO 14, R. A. De Mel Mawatha, Colombo 03',
                    country: '斯里兰卡',
                    contact: '071 899 5566 (上午10:00至下午6:00)'
                },
                receiver: receiveDetails,
                paymentMethod: data.payment.type.toUpperCase(),
                trackingNumber: '店内自提 - 待定',
                shippingMethod: data?.fulfillmentType === 'delivery' ? '配送服务: 待定' : '店内自提',
                pickupDate: data?.fulfillmentType === 'delivery' ? '' : `自提日期: ${moment(data?.pickupDate).format('YYYY-MM-DD')}`,
                pickupLocation: data?.pickUpLocation ? `${data?.pickUpLocation}` : '',
                shippingCharges: formatPrice(shippingCharge), // Assuming free shipping, adjust if needed
                shippingAddress: shippingAddress,
                items: data.items.map(item => ({
                    sku: item.sku || '--',
                    description: item.name,
                    price: formatPrice(item.price),
                    quantity: item.quantity,
                    total: formatPrice(item.price * item.quantity),
                    image: item?.image,
                    salePrice: formatPrice(item?.salesPrice),
                    ...item
                })),
                subTotal: formatPrice(subtotal),
                couponCode: '不适用',
                discount: 'LKR 0.00',
                customerNote: data?.billingAddress?.orderNote || '',
                siteWideOffer: data?.typeOfOffer?.enabledOffer,
                siteWideOfferReduceAmount: percentage,
                kokoOffer: isEnabledKokoOffer && data?.payment?.type === "koko",
                reduceKokoValue: formatPrice(isEnabledKokoOffer && data?.payment?.type === "koko" ? kokoReduceAmount * ((data?.typeOfOffer?.kokoParentage / 100) < 2500 ? data?.typeOfOffer?.kokoParentage / 100 : 2500) : 0),
                netAmount: formatPrice(data?.paymentId?.amount)
            })
        }

    }, [data, orderNote]);


    useEffect(() => {
        import('html2pdf.js').then((module) => {
            setHtml2pdf(() => module.default);
        });
    }, []);

    return (
        <div className="mb-5 border rounded-md p-3">
            <div className="flex gap-2 items-start flex-col justify-center">
                <div className="w-10 mx-auto">
                    <IconInvoice fill={'#CBD6E2'} />
                </div>
                <div className="text-center w-full space-y-3">
                    <h3 className="font-semibold">订单发票</h3>
                    <Button variant="outline" onClick={() => setOpenSheet(true)}>
                        <Download className="w-5 h-5 mr-2" />查看并下载
                    </Button>
                </div>
            </div>

            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                <SheetContent className="min-w-[80vw] overflow-y-auto">
                    <div ref={invoiceRef}>
                        <Invoice invoiceData={invoiceData} />
                    </div>

                    <div className="mt-6 text-center">
                        <Button
                            onClick={handleDownload}
                            disabled={isLoading}
                            variant="default"
                        >
                            <DownloadIcon />{isLoading ? '正在生成PDF...' : '下载发票PDF'}
                        </Button>
                        {/* <IsolatedPrintableComponent /> */}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}