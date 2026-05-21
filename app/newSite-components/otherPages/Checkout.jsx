"use client";

import CartSummery from '@/app/components/theme/checkout/cartSummery';
import ShippingAddress from '@/app/components/theme/checkout/shippingAddress';
import { SiteContext, transformS3UrlsInObject } from '@/app/contexts/siteContexts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ChevronLeft, ChevronRight, Loader2, LoaderCircle, MoveLeft, PencilIcon, Receipt, Slash, Truck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { apiReq, checkStock, getCartTotal } from '@/lib/common'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { v4 as uuidv4 } from 'uuid';
import { usePlaceOrder } from '@/app/hooks/usePlaceOrder';
import PaymentOptions from '@/app/components/theme/checkout/paymentOptions';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import LocationSelector from '@/app/components/theme/checkout/LocationSelector';
import moment from 'moment';
import { useTranslations } from 'next-intl';

import { useContextElement } from "@/app/newSite-context/Context";

const deliverySchema = z.object({
    firstName: z.string().min(2, {
        message: "First Name is required and must be at least 2 characters.",
    }),
    lastName: z.string().optional(),
    streetAddress: z.string().min(5, {
        message: "Street Address is required and must be at least 5 characters for delivery.",
    }).max(60, 'Street address must be 60 characters or fewer.'),
    addressLine2: z.string().optional(),
    townCity: z.string().min(5, {
        message: "Town/City is required and must be at least 5 characters for delivery.",
    }),
    postalCode: z.string().min(4, {
        message: "Postal code is required and must be at least 4 characters for delivery",
    }),
    email: z.string().email(),
    password: z.any().optional(),
    phone: z.string().min(10, {
        message: "Phone number must be 10 characters",
    }),
    orderNote: z.string().optional().default(""),
    fulfillmentType: z.literal('delivery')
});

const pickupSchema = z.object({
    pickUpLocation: z.string({
        required_error: "Please select a pickup location",
    }),
    firstName: z.string().min(2, {
        message: "First Name is required and must be at least 2 characters.",
    }),
    lastName: z.string().optional(),
    streetAddress: z.string().optional(),
    addressLine2: z.string().optional(),
    townCity: z.string().optional(),
    postalCode: z.string().optional(),
    email: z.string().email(),
    password: z.any().optional(),
    phone: z.string().min(10, {
        message: "Phone number must be 10 characters",
    }),
    orderNote: z.string().optional().default(""),
    fulfillmentType: z.literal('pickup'),
    pickupDate: z.date({
        required_error: "Please select a pickup date",
    }),
});

const checkoutFormSchema = z.discriminatedUnion('fulfillmentType', [
    deliverySchema,
    pickupSchema
]);

function CheckoutInner({
    siteKey
}) {
    const t = useTranslations("checkout");
    const { data: session, status } = useSession();
    const router = useRouter();
    const formRef = useRef(null);
    const [isCreateAccount, setIsCreateAccount] = useState(false);
    const [shipToDifferent, setShipToDifferent] = useState(false);
    const [openShipAddressModal, setOpenShipAddressModal] = useState(false);
    const [shippingAddress, setShippingAddress] = useState({});
    const [isPaymentSelected, setIsPaymentSelected] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEmail, setIsLoadingEmail] = useState(false);

    const [outOfStock, setOutOfStock] = useState({});
    const [isDisabledPlaceOrder, setIsDisabledPlaceOrder] = useState(false);
    const [showOutOfStockItemsAlert, setShowOutOfStockItemsAlert] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState({
        type: '',
        status: false
    });
    const [checkoutErrors, setCheckoutErrors] = useState('');
    const [selectedFulfillmentType, setFulfillmentType] = useState('');
    const [paymentUrl, setPaymentUrl] = useState('');
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [totalShippingCost, setTotalShippingCost] = useState(0);


    const { placeOrder, loading, orderedData } = usePlaceOrder();

    const { uniqueID, customer, storeData, cart, removeFromCart } = useContext(SiteContext);
    const hasCartItems = Array.isArray(cart) && cart.length > 0;


    if (cart && cart.length === 0) {
        // router.replace('/shop');
    }

    const isGiftCardAvailable = cart?.some((d) => d.isGiftCard);
    const isHaveSalesItems = cart?.some((d) => (d.salePrice !== null && d.salePrice !== 0));

    const calculateTotals = () => {
        if (!cart) return;

        const cartSubtotal = getCartTotal(cart);

        let discount = 0;
        let finalTotal = cartSubtotal;

        // Calculate discount if applicable
        if (!isGiftCardAvailable && storeData?.offers?.enabledOffer && !isHaveSalesItems) {
            discount = cartSubtotal * Number(storeData?.offers?.parentage) / 100;
            finalTotal = cartSubtotal - discount;
        }

        // Add shipping cost if applicable
        if (cartSubtotal < 15000 && storeData?.fulfillmentType !== 'pickup') {
            finalTotal += Number(storeData?.shipping?.flatRate);
        }

        return finalTotal;
    };



    const { control: checkoutController, handleSubmit: checkoutSubmit, setValue, reset, clearErrors, setError, formState: { errors }, getValues } = useForm({
        resolver: zodResolver(checkoutFormSchema),
        defaultValues: {
            firstName: "",
        },
    });


    const onSubmit = async (values) => {


        whenOpenCheck();


        let payload = {
            ...values,
            differentShipping: shippingAddress,
            selectedPayment,
            ...(values?.pickupDate && { pickupDate: new Date(moment(values.pickupDate).format('YYYY-MM-DD')) }),
        }

        if (outOfStock && outOfStock?.res?.status === 400) {
            setShowOutOfStockItemsAlert(true);
            return false;
        }


        // check use selected payment method
        if (selectedPayment && selectedPayment?.status && selectedPayment?.type !== "") {
            setIsPaymentSelected(true);

            // proceed to checkout process
            if (isCreateAccount) {
                checkCurrentEmailAddress();
                // create a account with user email and password
                if (payload && payload?.password) {
                    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
                    const validate = strongPasswordRegex.test(payload?.password);

                    if (!validate) {
                        setError("password", {
                            type: "custom",
                            message: validate ? "" : "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
                        });

                        return false;
                    } else {
                        clearErrors('password');

                        const fullUuid = uuidv4();
                        const truncatedUuid = fullUuid.substring(0, 8);

                        const registerNewUser = {
                            email: values?.email,
                            username: `${values?.firstName.replace(/[^a-zA-Z]/g, '')}_${truncatedUuid}`,
                            password: values?.password,
                            contactNumber: values?.phone || '',
                            uniqueID,
                        }

                        payload.isNewUser = registerNewUser;

                        setCheckoutErrors('');

                    }
                } else {
                    setError("password", {
                        type: "custom",
                        message: "Password is required"
                    });
                    return false;
                }
            }

            if (!isLoadingEmail) {
                // place an order
                try {

                    await placeOrder(payload);
                    // Handle success
                } catch (error) {
                    if (error.message === 'Request timeout') {
                        // Show timeout specific message to user
                        toast.error(t("orderTimeout"));
                    } else if (error.message.includes('HTTP error!')) {
                        // Show appropriate error based on status
                        toast.error(t("orderFailed"));
                    } else {
                        // Handle other errors
                        toast.error(t("unexpectedError"));
                    }
                }
            }

        } else {
            setIsPaymentSelected(false);
        }


    }

    const handlerShippingAddress = (shipping) => {
        setShippingAddress(shipping);
        setOpenShipAddressModal(false);
    }

    const checkCurrentEmailAddress = async () => {
        const registerEmailAddress = getValues('email');
        if (registerEmailAddress) {
            // check email address
            try {
                setIsLoadingEmail(true)
                const res = await apiReq('check-email', "POST", { email: registerEmailAddress });

                const { message } = await res?.json();
                if (message !== "ok") {
                    setError('email', {
                        type: "custom",
                        message,
                    });

                    setIsLoadingEmail(false)
                } else {
                    clearErrors('email');
                    setIsLoadingEmail(false)
                }

            } catch (error) {
                console.log(error);
                setIsLoadingEmail(false)
            } finally {
                setIsLoadingEmail(false)
            }
        }
    }

    const handlerShippingClose = () => {
        setOpenShipAddressModal(false);

        setShipToDifferent(shippingAddress && Object.keys(shippingAddress).length !== 0);
    }

    const handlerChangeFulfillType = (type) => {
        setFulfillmentType(type);
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
            setShowOutOfStockItemsAlert(false);
        } else {
            setOutOfStock({});
        }
    }

    const whenOpenCheck = async () => {
        const respond = await checkStock(cart);
        // setIsDisabledPlaceOrder


        if (!respond?.insufficientItems || !cart) return;

        const outOfStockProductIds = respond.insufficientItems
            .filter(d => !d.isStockSufficient)
            .map(d => d.productId);

        const outOfStockCartItems = cart.filter(d =>
            outOfStockProductIds.includes(d.productId)
        );

        const getRemainingCartItems = cart?.filter((d) => !outOfStockCartItems?.includes(d));

        setIsDisabledPlaceOrder(!getRemainingCartItems)


        if (outOfStockCartItems && outOfStockCartItems.length > 0) {

        }

        if (respond && respond?.res?.status === 400) {
            setOutOfStock({
                ...respond,
            } || {});
        } else {
            setOutOfStock({});
        }
    }

    const initiateCheckoutPageView = async (items) => {
        const getTotal = calculateTotals();

        // 跟踪结账发起
        // await trackInitiateCheckout({
        //     value: getTotal || 0,
        //     currency: 'LKR',
        //     user: {},
        //     items: items
        // });
    }


    useEffect(() => {
        setValue('fulfillmentType', selectedFulfillmentType);
        // console.log('checkoutController', checkoutController);
        // Clear any existing errors for address fields when switching to pickup
        if (selectedFulfillmentType === 'pickup') {
            clearErrors(['streetAddress', 'townCity', 'postalCode']);
            setValue('streetAddress', '');
            setValue('townCity', '');
            setValue('postalCode', '');
        }
    }, [selectedFulfillmentType, setValue, clearErrors]);


    useEffect(() => {
        if (selectedPayment && selectedPayment?.status && selectedPayment?.type !== "") {
            setIsPaymentSelected(true);
            // const kokoUrl = 'https://qaapi.paykoko.com/api/merchants/orderCreate'
            const kokoUrl = 'https://prodapi.paykoko.com/api/merchants/orderCreate'

            // const visaUrl = 'https://secureacceptance.cybersource.com/pay'
            const visaUrl = 'https://secureacceptance.cybersource.com/pay'

            // const payhereUrl = 'https://sandbox.payhere.lk/pay/checkout'
            const payhereUrl = 'https://www.payhere.lk/pay/checkout'

            if (selectedPayment?.type === "koko" || selectedPayment?.type === "visa") {
                const getTypeRelatedUrl = selectedPayment?.type === "koko" ? kokoUrl : visaUrl;
                setPaymentUrl(getTypeRelatedUrl);
            } else if (selectedPayment?.type === "payhere") {
                setPaymentUrl(payhereUrl);
            } else if (selectedPayment?.type === "paypal" || selectedPayment?.type === "stripe") {
                // PayPal 和 Stripe 不需要设置 URL，因为它们使用 API 响应中的重定向 URL
                setPaymentUrl('');
            } else {
                setPaymentUrl('');
            }
        }

        setIsPaymentSelected(null);

    }, [selectedPayment]);


    useEffect(() => {
        if (orderedData && Object.keys(orderedData).length !== 0) {

            const uniqueID = localStorage.getItem('uniqueID');

            if (orderedData?.payment?.type === 'cod' || orderedData?.payment?.type === 'bankTransfer') {
                router.push(`/order-confirm?orderId=${orderedData?._id}&uniqueID=${uniqueID}`);

                toast.success(t("orderPlacedSuccessfully"), {
                    description: t("orderDetailsEmail")
                });

                setIsLoading(false);

            } else if (orderedData?.payment?.type === 'paypal' || orderedData?.payment?.type === 'stripe') {
                // PayPal 和 Stripe 使用 API 返回的重定向 URL
                setIsLoading(true);
                
                if (orderedData.redirectUrl) {
                    // 直接重定向到 PayPal/Stripe 提供的 URL
                    window.location.href = orderedData.redirectUrl;
                    
                    toast.success(t("orderPlaced"), {
                        description: t("redirectingPayment")
                    });
                } else {
                    toast.error(t("paymentInitializationFailed"), {
                        description: t("paymentRedirectMissing")
                    });
                    setIsLoading(false);
                }
            } else {
                setIsLoading(true);
                if (orderedData && typeof orderedData === 'object') {
                    Object.keys(orderedData).forEach(key => {
                        const input = document.createElement('input');
                        input.type = 'hidden';
                        input.name = key;
                        input.value = orderedData[key];

                        formRef.current.appendChild(input);
                    });

                    // console.log("formRef", orderedData);
                    
                    // Submit the form
                    formRef.current.submit();
                }

                toast.success(t("orderPlaced"), {
                    description: t("redirectToPayment")
                });

                setIsLoading(false)
            }
        }

    }, [orderedData, router, t]);


    useEffect(() => {
        initiateCheckoutPageView(cart);
        if (cart && cart.length > 0) {
            whenOpenCheck();
        }

    }, [cart]);



    useEffect(() => {
        if (customer && customer?.user && Object.keys(customer?.user).length !== 0) {
            const { user, metaData } = customer;

            setValue('firstName', user?.firstName);
            setValue('lastName', user?.lastName);
            setValue('email', user?.email);
            setValue('phone', user?.phone || '');

            if (metaData && Object.keys(metaData).length !== 0) {
                const billingAddress = metaData?.billingAddress;

                const getDefaultAddress = billingAddress?.find((d) => d.isDefault) || metaData[0]?.billingAddress[0];

                setValue('streetAddress', getDefaultAddress?.street);
                setValue('addressLine2', getDefaultAddress?.addressLine2);
                setValue('townCity', getDefaultAddress?.city);
                setValue('phone', getDefaultAddress?.phone);
                setValue('postalCode', getDefaultAddress?.zip);
            }
        }

    }, [customer]);


    useEffect(() => {
        if (isCreateAccount) {
            checkCurrentEmailAddress();
        } else {
            clearErrors('email');
        }
    }, [isCreateAccount]);

    useEffect(() => {
        if (storeData) {
            setFulfillmentType(storeData?.fulfillmentType)
        }
    }, [storeData]);

    return (
        <div>

            <div className='xl:px-[9.5vw] mx-auto my-5 min-h-[40vh]'>
                {checkoutErrors !== "" && <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle className="text-xs">{t("error")}</AlertTitle>
                    <AlertDescription className="text-xs">
                        {checkoutErrors}
                    </AlertDescription>
                </Alert>}

                <Form {...checkoutController}>
                    <div className='flex gap-5 flex-col xl:flex-row'>
                        <div className='xl:w-7/12 p-4 xl:p-0 xl:pr-12'>
                            <div className='flex flex-col gap-3 mb-3 items-start border-b-2 border-black'>
                                {/* <Button onClick={() => router.push('/cart')} variant="ghost" className="p-0 flex gap-2 items-center rounded-none uppercase text-xs tracking-wider font-headingFontMedium"><ChevronLeft className="w-4 h-4 " />Back to cart</Button> */}
                                <div className='flex gap-2 items-center'>
                                    <h2 className='text-lg font-semibold font-headingFontMedium uppercase tracking-wider'>{t("billingDetails")}</h2>
                                </div>
                            </div>


                            <div className='flex gap-5 w-[100%] flex-grow mb-5'>
                                <FormField
                                    control={checkoutController}
                                    name="firstName"

                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-xs font-semibold">{t("firstName")}<span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-3xl w-full"
                                                    placeholder="Jhon"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={checkoutController}
                                    name="lastName"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-xs font-semibold">{t("lastName")}</FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-3xl w-full"
                                                    placeholder="Doe"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <LocationSelector
                                selectedFulfillmentType={selectedFulfillmentType}
                                setFulfillmentType={handlerChangeFulfillType}
                                onChangeSelect={() => { }}
                                control={checkoutController}
                            />

                            {selectedFulfillmentType === 'delivery' &&
                                <>
                                    <div className='flex gap-2 items-center border-b-2 border-black mb-3'>
                                        <h2 className='text-lg font-semibold font-headingFontMedium uppercase tracking-wider'>{t("address")}</h2>
                                    </div>


                                    <div className='flex flex-col md:flex-row gap-5 w-[100%] flex-grow mb-5'>
                                        <FormField
                                            control={checkoutController}
                                            name="streetAddress"

                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                            <FormLabel className="text-xs font-semibold">{t("streetAddress")}<span className='text-red-500'>*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="rounded-3xl w-full leading-2"
                                                            placeholder={t("streetAddress")}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={checkoutController}
                                            name="addressLine2"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                            <FormLabel className="text-xs font-semibold">{t("addressLine2")}</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="rounded-3xl w-full leading-2"
                                                            placeholder={t("addressLine2")}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='flex gap-5 w-[100%] flex-grow mb-5'>
                                        <FormField
                                            control={checkoutController}
                                            name="townCity"

                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                            <FormLabel className="text-xs font-semibold">{t("townCity")}<span className='text-red-500'>*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="rounded-3xl w-full leading-2"
                                                            placeholder={t("townCity")}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={checkoutController}
                                            name="postalCode"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                            <FormLabel className="text-xs font-semibold">{t("postalCode")}<span className='text-red-500'>*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="rounded-3xl w-full leading-2"
                                                            placeholder={t("postalCode")}
                                                            inputMode="numeric"
                                                            {...field}
                                                            onChange={(e) => {
                                                                const cleanedStr = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                                                                field.onChange(cleanedStr); // Keep as string
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className='flex items-center gap-2 mb-3'>
                                        <div className='font-semibold flex items-center gap-2 text-sm'>Sri Lanka - <p className='font-normal text-muted-foreground text-xs italic'>{t("shipWithinSriLanka")}</p></div>
                                    </div>
                                </>}

                            <div className='flex gap-2 items-center border-b-2 border-black mb-3'>
                                <h2 className='text-lg font-semibold font-headingFontMedium uppercase tracking-wider'>{t("contactInformation")}</h2>
                            </div>
                            <div className='flex flex-col md:flex-row gap-5 w-[100%] flex-grow mb-5'>
                                <FormField
                                    control={checkoutController}
                                    name="email"

                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-xs font-semibold">{t("email")}<span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-3xl w-full"
                                                    placeholder={t("email")}
                                                    inputMode="email"
                                                    {...field}
                                                />
                                            </FormControl>
                                            {isLoadingEmail && <div className='flex items-center gap-3'>
                                                <LoaderCircle className='w-4 h-4 animate-spin' />
                                                <p className='text-muted-foreground text-xs'>{t("checkingEmail")}</p>
                                            </div>}
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={checkoutController}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem className="w-full">
                                            <FormLabel className="text-xs font-semibold">{t("phone")}<span className='text-red-500'>*</span></FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="rounded-3xl w-full"
                                                    placeholder={t("phone")}
                                                    inputMode="numeric"
                                                    {...field}
                                                    onChange={(e) => {
                                                        const cleanedStr = e.target.value.replace(/[^0-9]/g, ''); // Only allow numbers
                                                        field.onChange(cleanedStr);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>


                            {!session && <div className='space-y-3 mb-5'>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <Switch id="create-new-account"
                                            checked={isCreateAccount}
                                            onCheckedChange={() => setIsCreateAccount((prevState) => !prevState)}
                                        />
                                        <Label htmlFor="create-new-account">{t("createAccount")}</Label>
                                    </div>

                                    {isCreateAccount && <div className='space-y-3 pt-3'>
                                        <FormField
                                            control={checkoutController}
                                            name="password"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                            <FormLabel className="text-xs font-semibold">{t("password")}<span className='text-red-500'>*</span></FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            className="rounded-3xl w-full"
                                                            placeholder="**********"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="text-xs" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>}
                                </div>
                            </div>}

                            {selectedFulfillmentType === 'delivery' && <>
                                <div className='flex gap-2 items-center border-b-2 border-black mb-3'>
                                    <h2 className='text-lg font-semibold font-headingFontMedium uppercase tracking-wider'>{t("shipTo")}</h2>
                                </div>

                                <div className='flex flex-col md:flex-row gap-5 w-[100%] flex-grow mb-5'>
                                    <div className='flex-1'>
                                        <div onClick={() => {
                                            setShipToDifferent(false)
                                            setOpenShipAddressModal(false);
                                        }} className={`flex items-center px-5 py-4 gap-7 border-[1px] cursor-pointer rounded-full font-headingFontMedium uppercase text-sm ${!shipToDifferent ? 'text-black bg-black' : 'text-gray-500 hover:text-black hover:border-black transition ease-in-out'}`}>
                                            <Receipt className='w-6 h-6' />
                                            {t("billingAddress")}
                                        </div>
                                    </div>
                                    <div className='flex-1'>
                                        <div onClick={() => {
                                            setShipToDifferent(true);
                                            setOpenShipAddressModal(true);
                                        }} className={`flex items-center border-[1px] px-5 py-4 gap-3 cursor-pointer rounded-full font-headingFontMedium uppercase text-sm ${shipToDifferent ? 'text-black bg-black' : 'text-gray-500 hover:text-black hover:border-black transition ease-in-out'}`}>
                                            <Truck className='w-6 h-6' />{t("differentAddress")}
                                        </div>
                                    </div>
                                </div>

                                {shipToDifferent && shippingAddress && Object.keys(shippingAddress).length !== 0 && <div className='relative p-5 border-[1px] mb-5 rounded-2xl'>

                                    <div>
                                        <h3 className='uppercase text-sm text-muted-foreground font-headingFontMedium mb-2'>{t("addressHeading")}</h3>
                                        <address className='not-italic mb-3 text-sm'>
                                            {shippingAddress.firstName} {shippingAddress?.lastName}<br />
                                            {shippingAddress.streetAddress}, {shippingAddress?.addressLine2}<br />
                                            {shippingAddress.townCity}, {shippingAddress?.postalCode ? `Postal code: ${shippingAddress.postalCode}` : ''}<br />
                                        </address>

                                        <h3 className='uppercase text-sm text-muted-foreground font-headingFontMedium mb-2'>{t("contactHeading")}</h3>
                                        <div className='flex flex-col text-sm'>
                                            <div>Email: {shippingAddress.email}</div>
                                            {shippingAddress?.phone && <div>Phone: {shippingAddress.phone}</div>}
                                        </div>
                                    </div>

                                    <Button className="rounded-full absolute top-2 right-2" onClick={() => setOpenShipAddressModal(true)}>
                                        <PencilIcon className='w-5 h-5' />
                                    </Button>
                                </div>}
                            </>}

                            <FormField
                                control={checkoutController}
                                name="orderNote"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                            <FormLabel className="text-xs font-semibold">{t("orderNote")}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                className="rounded-2xl w-full"
                                            placeholder={t("orderNote")}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <div className='xl:w-5/12 rounded-3xl border border-black/10 bg-[#f7f5f0] text-black shadow-sm'>

                            <div className='p-6 xl:p-10'>
                                {outOfStock && outOfStock?.showMessage && <Alert variant="destructive" className="mb-3 rounded-none text-xs">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{t("insufficientStockTitle")}</AlertTitle>
                                    <AlertDescription className="text-xs">
                                        {t("insufficientStockDescription")}
                                    </AlertDescription>
                                </Alert>}

                                {cart?.some((d) => (d.salePrice !== null && d.salePrice !== 0)) && <div className='bg-red-50 border-[1px] border-red-100 text-red-600 p-3 mb-4 rounded-3xl text-xs'>
                                    <b>{t("note")}</b>: {t("saleNote")}
                                </div>}
                                {hasCartItems ? (
                                    <CartSummery tone="light" outOfStockItems={outOfStock} totalShippingCost={(d) => setTotalShippingCost(d)} />
                                ) : (
                                    <div className="rounded-3xl border border-black/10 bg-white p-6 text-center">
                                        <h3 className="font-headingFontMedium text-sm uppercase tracking-wider text-black">{t("emptyCartTitle")}</h3>
                                        <p className="mt-2 text-xs text-black/60">{t("emptyCartDescription")}</p>
                                        <Link href="/shop-default-grid" className="mt-4 inline-flex rounded-full border border-black bg-black px-5 py-3 text-xs font-semibold uppercase text-white transition hover:bg-white hover:text-black">
                                            {t("continueShopping")}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {hasCartItems && (
                                <>
                                    {/* payment options */}
                                    <PaymentOptions tone="light" selectedPayment={selectedPayment} isPaymentSelected={isPaymentSelected} setSelectedPayment={(d) => setSelectedPayment(d)} />


                                    <div className='mb-5 px-6 xl:px-10 xl:mb-10'>
                                        <div className='text-xs text-black/60 mb-5 text-center'>{t("privacyNotice")} <Link href="/help/privacy-policy" className='underline hover:text-black'>{t("privacyPolicy")}</Link>.</div>
                                        {/* <ReCAPTCHA
                                            sitekey={siteKey}
                                            onChange={handleRecaptchaChange}
                                        /> */}

                                        {errors && Object.keys(errors).length !== 0 && (
                                            <div className='text-xs text-red-500 text-center mb-3 capitalize'>
                                                {t("reviewFields")} {Object.keys(errors).join(', ')}
                                            </div>
                                        )}

                                        <Button
                                            onClick={checkoutSubmit(onSubmit)}
                                            className="w-max mx-auto rounded-full bg-black text-white font-headingFontMedium uppercase flex gap-2 items-center justify-center border-[1px] border-black transition-all ease-in-out hover:bg-white hover:text-black"
                                            disabled={loading || isLoading || isDisabledPlaceOrder || storeData?.general?.disabledPlaceOder}
                                        >
                                            {(loading || isLoading) && <LoaderCircle className='w-4 h-4 animate-spin' />}
                                            {storeData?.general?.disabledPlaceOder ? t("orderingDisabled") : t("placeOrder")}
                                            <ChevronRight size={15} />
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </Form>
            </div>

            <AlertDialog open={openShipAddressModal} onOpenChange={() => setOpenShipAddressModal(false)}>
                <AlertDialogContent className="rounded-[50px] max-w-[800px]">
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <div className='flex gap-2 flex-col items-start justify-start border-b-2 border-black'>
                                <h2 className='text-lg font-semibold font-headingFontMedium uppercase tracking-wider'>{t("shipDifferentTitle")}</h2>
                                <p className='text-xs text-muted-foreground font-normal mb-3'>{t("shipDifferentDescription")}</p>
                            </div>
                        </AlertDialogTitle>
                    </AlertDialogHeader>

                    <ShippingAddress
                        onClose={handlerShippingClose}
                        onSubmitData={handlerShippingAddress}
                        data={shippingAddress}
                    />
                </AlertDialogContent>
            </AlertDialog>


            <AlertDialog open={showOutOfStockItemsAlert} onOpenChange={() => setShowOutOfStockItemsAlert(false)} className="rounded-3xl">

                <AlertDialogContent className="rounded-3xl md:rounded-3xl" style={{
                    borderRadius: 30
                }}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("confirmationRequired")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("removeOutOfStockPrompt")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-3xl" onClick={() => setShowOutOfStockItemsAlert(false)}>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRemoveItems} className="rounded-xl" disabled={confirmLoading}>{confirmLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{t("continue")}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <form ref={formRef} action={paymentUrl} method="post"></form>

        </div>
    )
}

export default function Checkout() {
    const t = useTranslations("checkout");
    const { cartProducts, setCartProducts } = useContextElement();

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

    // Sync cart state
    useEffect(() => {
        setCart(cartProducts);
    }, [cartProducts]);

    // Initialize User Data (Copied from SiteContext.js)
    const generateUniqueID = () => {
        return '_' + Math.random().toString(36).substr(2, 19);
    };

    const getUserBrowserInfo = () => {
        if (typeof window !== 'undefined') {
            return window.navigator.userAgent;
        }
        return '';
    };

    const getUserIPAddress = async () => {
        if (
            typeof window !== 'undefined' &&
            ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname)
        ) {
            return null;
        }

        try {
            const response = await fetch('https://api64.ipify.org?format=json');
            const data = await response.json();
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

                // setCart(data?.cart || []); // Use newSite cart instead
                // setCartId(data?.cartId)
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
            }
        } catch (error) {
            console.error('Error fetching cart data:', error);
            // setCart([]);
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
                setCartProducts(data?.cart); // Update newSite context

                toast.success(t("cartUpdated"));

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

    const removeAllFromCart = async () => {
        try {
            const res = await apiReq('site/cart', 'POST', {
                uniqueID: uniqueID,
                cart: [],
            });

            if (res && res.status === 200) {
                setCartProducts([]); // Update newSite context
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
                setCartProducts(data?.cart); // Update newSite context

                toast.success(t("cartUpdated"));

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
    }, [cart, ipAddress, browserInfo, uniqueID, setCartProducts, t]);

    useEffect(() => {
        let isMounted = true;
        async function initializeUser() {
            let storedID = localStorage.getItem('uniqueID');
            if (!storedID) {
                storedID = generateUniqueID();
                localStorage.setItem('uniqueID', storedID);
            }
            setUniqueID(storedID);

            await getCustomer(storedID);

            const userBrowserInfo = getUserBrowserInfo();
            setBrowserInfo(userBrowserInfo);

            const ipData = await getUserIPAddress();
            const commonUserData = await getCommonData();

            setThemeData(transformS3UrlsInObject(commonUserData));
            setIPAddress(ipData?.ip);
            setIPAddressDataSet(ipData?.ipDataSet);
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


    return (
        <SiteContext.Provider value={{
            uniqueID,
            cart,
            cartId,
            setCart: setCartProducts, // Directly map to setCartProducts
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
            <CheckoutInner />
        </SiteContext.Provider>
    );
}
