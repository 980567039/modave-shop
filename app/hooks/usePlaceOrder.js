"use state";

import { useCallback, useContext, useState } from 'react';
import { SiteContext } from '../contexts/siteContexts';
import { apiReq } from '@/lib/common';
import { toast } from 'sonner';

export function usePlaceOrder() {
    const [state, setState] = useState({
        loading: false,
        error: null,
        orderedData: null
    });

    const {
        cart,
        cartId,
        ipAddressDataSet,
        customer,
        uniqueID,
        setCustomer,
        storeData
    } = useContext(SiteContext);

    const placeOrder = useCallback(async (orderData) => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        const payload = {
            userSiteUniqueID: uniqueID || "",
            date: new Date(),
            status: "pending",
            billingAddress: [{
                firstName: orderData?.firstName || "",
                lastName: orderData?.lastName || "",
                phone: orderData?.phone || "",
                email: orderData?.email || "",
                street: orderData?.streetAddress || '',
                addressLine2: orderData?.addressLine2 || '',
                city: orderData?.townCity || "",
                state: ipAddressDataSet?.regionName || "",
                zip: orderData?.postalCode || "",
                country: ipAddressDataSet?.country || "",
                orderNote: orderData?.orderNote || ""
            }],
            email: orderData?.email,
            shippingAddress: [
                orderData?.differentShipping ? {
                    firstName: orderData?.differentShipping?.firstName || "",
                    lastName: orderData?.differentShipping?.lastName || "",
                    phone: orderData?.differentShipping?.phone || "",
                    email: orderData?.differentShipping?.email || "",
                    street: orderData?.differentShipping?.streetAddress || "",
                    addressLine2: orderData?.differentShipping?.addressLine2 || '',
                    city: orderData?.differentShipping?.townCity || "",
                    state: "",
                    zip: orderData?.differentShipping?.postalCode || "",
                    country: ""
                } : {}
            ],
            payment: orderData?.selectedPayment || {},
            items: cart || [],
            cartId,
            shippingTotal: storeData?.fulfillmentType === 'delivery' ?
                storeData?.shipping?.flatRate : 0,
            orderStatus: 'Pending',
            fulfillmentType: orderData?.fulfillmentType || 'delivery',
            pickUpLocation: orderData?.pickUpLocation || '',
            storeData,
            ...(orderData?.pickupDate && { pickupDate: orderData.pickupDate }),
            ...(orderData?.isNewUser && { isNewUser: orderData.isNewUser }),
            ...(customer?.user && { user: customer.user.id })
        };

        try {
            const response = await apiReq('site/order/place', "POST", payload, null, 60000);


            if (!response.ok) {
                toast.error("Failed to place order", {
                    description: "Please try again later"
                });
                throw new Error('Failed to place order');
            }

            const { data } = await response.json();

            setCustomer(prev => ({
                ...prev,
                metaData: [{
                    ...prev.metaData,
                    billingAddress: [{
                        ...prev?.metaData?.billingAddress,
                        ...data?.billingAddress
                    }]
                }]
            }));

            setState({
                loading: false,
                error: null,
                orderedData: data
            });



        } catch (error) {
            setState(prev => ({
                ...prev,
                loading: false,
                error: error.message || 'An error occurred while placing the order'
            }));
        }
    }, [cart, cartId, ipAddressDataSet, customer, uniqueID, setCustomer, storeData]);

    return {
        placeOrder,
        loading: state.loading,
        error: state.error,
        orderedData: state.orderedData
    };
}