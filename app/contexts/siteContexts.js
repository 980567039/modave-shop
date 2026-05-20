"use client";
import { Button } from '@/components/ui/button';
import analytics from '@/lib/analytics';
import { apiReq } from '@/lib/common';
import { usePathname, useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import AnalyticsProvider from './analyticsProvider';
import { trackVisitor } from '../hooks/useVisitorTracking';


export const transformS3UrlsInObject = (obj) => {
    // Return if obj is null or not an object/array
    if (!obj || typeof obj !== 'object') {
        if (typeof obj === 'string' && obj.includes('uptown-selections.s3.eu-north-1.amazonaws.com')) {
            const fileId = obj.split('/').pop();
            return `/uploads/${fileId}.webp`;
        }
        return obj;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        return obj.map(item => transformS3UrlsInObject(item));
    }

    // Handle objects
    const transformed = {};
    for (const key in obj) {
        transformed[key] = transformS3UrlsInObject(obj[key]);
    }

    return transformed;
}

// Create the context
const SiteContext = createContext();


// Create a provider component
const SiteProvider = ({ children }) => {
    const [uniqueID, setUniqueID] = useState(null);
    const [cart, setCart] = useState([]);
    const [browserInfo, setBrowserInfo] = useState('');
    const [ipAddress, setIPAddress] = useState('');
    const [cartId, setCartId] = useState('');
    const [ipAddressDataSet, setIPAddressDataSet] = useState({});
    const [openCartModal, setOpenCartModal] = useState(false);
    const [isLoading, setIsLoading] = useState({});
    const [customer, setCustomer] = useState({});
    const [storeData, setStoreData] = useState({
        fulfillmentType: 'delivery'
    });
    const [themeData, setThemeData] = useState({});
    const [cartTotal, setCartTotal] = useState(0);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Function to generate a unique ID
    const generateUniqueID = () => {
        return '_' + Math.random().toString(36).substr(2, 19);
    };

    // Function to get user browser information
    const getUserBrowserInfo = () => {
        const userAgent = window.navigator.userAgent;
        return userAgent;
    };

    // Function to get user IP address
    const getUserIPAddress = async () => {
        try {
            const response = await fetch('https://api64.ipify.org?format=json');
            const data = await response.json();

            // const countryResponse = await fetch(`http://ip-api.com/json/${data.ip}`);
            const country = {};

            return {
                ip: data.ip,
                ipDataSet: country,
            };
        } catch (error) {
            console.error('Error fetching IP address:', error);
            return null;
        }
    };

    const getCommonData = async () => {
        try {
            const res = await apiReq(`site/common`, "GET");
            const { data } = await res?.json();

            return data;
        } catch (error) {
            console.error('Error common data fetch:', error);
            return null;
        }
    };


    const getCustomer = async (uid) => {
        try {
            setIsLoading({
                item: {},
                status: true,
            });
            const customerData = await apiReq(`site/account/user?uid=${uid}`, 'GET');

            if (customerData && customerData.status === 200) {
                const { data } = await customerData.json();

                setCart(data?.cart || []);
                setCartId(data?.cartId)
                setCustomer({
                    user: data?.user,
                    metaData: data?.userMeta
                });

                setStoreData((prevData) => ({
                    ...prevData,
                    ...data?.storeData
                }));

                setIsLoading({
                    item: {},
                    status: false,
                });
            } else {
                console.error('Failed to fetch cart data:', customerData?.status, customerData?.statusText);
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
            setCart([]);
        } finally {
            setIsLoading({
                item: {},
                status: false,
            });
        }
    };

    const removeFromCart = async (product) => {
        try {
            setIsLoading({
                item: product,
                status: true,
            });

            const getClearItems = cart?.filter(item => item.randomKey !== product.randomKey);

            const res = await apiReq('site/cart', 'POST', {
                uniqueID,
                cart: getClearItems,
                ip: ipAddress || '',
                browser: browserInfo || ''
            });

            if (res && res.status === 200) {
                const { data } = await res.json();
                setCart(data?.cart);

                toast.success("Cart is updated");

            } else {
                console.log("Failed to save cart data:", res.statusText);
            }

            setIsLoading({
                item: product,
                status: false,
            })

        } catch (error) {
            console.log(error);
        }
    };

    const removeAllFromCart = async (uid) => {
        try {
            const res = await apiReq('site/cart', 'POST', {
                uniqueID: uid || uniqueID,
                cart: [],
            });

            if (res && res.status === 200) {
                setCart([]);
            } else {
                console.log("Failed to clear cart data:", res.statusText);
            }

        } catch (error) {
            console.log(error);
        }
    };

    const updateCartItem = useCallback(async (product, quantity) => {

        try {
            setIsLoading({
                item: product,
                status: true,
            });


            const updatedCartItems = cart?.map(item =>
                item.randomKey === product.randomKey ? { ...item, quantity: Math.max(1, quantity) } : item
            );

            const res = await apiReq('site/cart', 'POST', {
                uniqueID,
                cart: updatedCartItems,
                ip: ipAddress || '',
                browser: browserInfo || ''
            });

            if (res && res.status === 200) {
                const { data } = await res.json();
                setCart(data?.cart);

                toast.success("Cart is updated");

            } else {
                console.log("Failed to save cart data:", res.statusText);
            }

            setIsLoading({
                item: product,
                status: false,
            })
        } catch (error) {
            console.log(error);
            setIsLoading({
                item: product,
                status: false,
            })
        }

        setIsLoading({
            item: product,
            status: false,
        })


    }, [cart])

    useEffect(() => {
        let isMounted = true;
        async function initializeUser() {
            // Check if unique ID exists in localStorage
            let storedID = localStorage.getItem('uniqueID');

            if (!storedID) {
                // Generate a new unique ID if it doesn't exist
                storedID = generateUniqueID();
                localStorage.setItem('uniqueID', storedID);
            }

            // fetch user if available
            await getCustomer(storedID);

            setUniqueID(storedID);

            // await trackVisitor(storedID)


            // Fetch user browser information
            const userBrowserInfo = getUserBrowserInfo();
            setBrowserInfo(userBrowserInfo);

            // Fetch user IP address
            const ipData = await getUserIPAddress();
            const commonUserData = await getCommonData();



            setThemeData(transformS3UrlsInObject(commonUserData));

            setIPAddress(ipData?.ip);
            setIPAddressDataSet(ipData?.ipDataSet);

            // Identify the user in analytics
            analytics.identify(storedID, {
                browserInfo: userBrowserInfo,
                ipAddress: ipData?.ip,
                // Add any other user properties you want to track
            });
        }
        if (isMounted) {
            initializeUser();
        }

        return () => {
            isMounted = false;
        }
    }, []);

    useEffect(() => {
        const totalAmount = cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        setCartTotal(totalAmount)
    }, [cart]);

    useEffect(() => {
        if (pathname) {
            // Track page view
            analytics.page({
                url: pathname,
                search: searchParams.toString(),
                uniqueID: uniqueID,
                // Add any other page properties you want to track
            });
        }
    }, [pathname, searchParams, uniqueID]);

    return (
        <SiteContext.Provider value={{
            uniqueID,
            cart,
            cartId,
            setCart,
            removeFromCart,
            removeAllFromCart,
            updateCartItem,
            browserInfo,
            ipAddress,
            isLoading,
            setOpenCartModal,
            openCartModal,
            ipAddressDataSet,
            customer,
            setCustomer,
            cartTotal,
            storeData,
            setStoreData,
            themeData,
            setThemeData
        }}>
            <AnalyticsProvider>
                {children}
            </AnalyticsProvider>
        </SiteContext.Provider>
    );
};

export { SiteContext, SiteProvider };
