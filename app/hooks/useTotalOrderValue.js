import { useState, useEffect, useContext } from 'react';
import { SiteContext } from '../contexts/siteContexts';
import { getCartTotal } from '@/lib/common';

const useTotalOrderValue = (query) => {
    const [orderValue, setOrderValue] = useState(0);
    const { cart, storeData } = useContext(SiteContext);

    useEffect(() => {
        const getCartTotalValue = getCartTotal(cart);
        const isGiftCardAvailable  = cart?.some((d) => d.isGiftCard);

        if (storeData && storeData?.fulfillmentType !== 'pickup') {
            const calculatedValue = getCartTotalValue > 15000 ? getCartTotalValue : getCartTotalValue + storeData?.shipping?.flatRate;
            setOrderValue(calculatedValue)
        } else {
            setOrderValue(getCartTotalValue)
        }
    }, [storeData]);

    return orderValue;
};

export default useTotalOrderValue;