"use client";
import { useState, useCallback, useMemo, useContext, useEffect } from 'react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatPrice, getFullDomain, getTypeOfAttribute } from '@/lib/common';
import { Car, X } from 'lucide-react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import QuickViewProducts from '../product/quickViewProducts';
import Link from 'next/link';
import { SiteContext } from '@/app/contexts/siteContexts';
import { IconDelivery } from '../../svgIcons';

export default function ProductCard({ data, onBlack }) {
    const [selectColor, setSelectedColor] = useState('');
    const [mainImage, setMainImage] = useState('');
    const [secondMainImage, setSecondMainImage] = useState('');
    const [price, setPrice] = useState(data?.price || '');
    const [salePrice, setSalePrice] = useState(data?.salePrice || '');
    const [offerPrice, setOfferPrice] = useState('');
    const [hostName, setSetHostName] = useState('');
    const [isEnabledFreeShippingTag, setIsEnabledFreeShippingTag] = useState(false);
    const { storeData } = useContext(SiteContext);
    const router = useRouter();

    // Update states when data changes
    useEffect(() => {
        setMainImage(data?.defaultImage?.url);
        setSecondMainImage(data?.imageGallery && data?.imageGallery.length > 0 ? data?.imageGallery[0]?.url : null);
        setPrice(data?.price || '');
        setSalePrice(data?.salePrice || '');
        setSelectedColor('');
    }, [data]);

    // Calculate offer price when store data changes
    useEffect(() => {
        if (storeData?.offers?.enabledOffer) {
            const discount = data?.price * Number(storeData?.offers?.parentage) / 100;
            setOfferPrice(discount);
        }
    }, [storeData?.offers, data?.price]);

    const handlerClickProduct = useCallback(() => {
        // router.push(`/product/${data.titleSlug}`);
    }, [router, data.titleSlug]);

    const getProductByColorAndSize = useCallback((attr, color, size) => {
        return attr.filter(product =>
            product.attributes.color.value === color &&
            product.attributes.size.value === size
        );
    }, []);

    const setImageUrl = (url) => {
        // const findUrl = url.startsWith('/uploads/');
        // console.log(findUrl)
        // if (findUrl) {
        //     return getFullDomain() + getImageKey(url);
        // } else {
            // return url;
            return url || 'https://dummyimage.com/400x600/ddd/000';
        // }
    }

    const handlerSwitchColor = useCallback((color) => {
        const getInitValues = data?.attributes?.filter(product =>
            product.attributes.color.value === color?.value
        );

        if (getInitValues[0]) {
            const getSizes = getInitValues.map((attr) => ({
                stock: attr.stock || false,
                value: attr.attributes.size.value
            }));
            const getAvailableAttr = getProductByColorAndSize(
                data?.attributes,
                color?.value,
                getSizes.find((d) => d.stock !== false)?.value
            );

            setSelectedColor(color?.value);

            if (getAvailableAttr[0]) {
                setMainImage(getAvailableAttr[0]?.image || data?.defaultImage?.url);
                setSecondMainImage(getAvailableAttr[0]?.image ||
                    (data?.imageGallery && data?.imageGallery.length > 0 ? data?.imageGallery[0]?.url : null));
                setPrice(getAvailableAttr[0]?.price || data?.price);
                setSalePrice('');
            } else {
                setPrice(data?.price);
            }
        }
    }, [data, getProductByColorAndSize]);

    const handlerClearSelect = useCallback(() => {
        setMainImage(data?.defaultImage?.url);
        setSecondMainImage(data?.imageGallery && data?.imageGallery.length > 0 ? data?.imageGallery[0]?.url : null);
        setPrice(data?.price);
        setSalePrice(data?.salePrice || '');
        setSelectedColor('');
    }, [data]);

    const isNew = useMemo(() => {
        // Check if createdAt exists and is not an empty object
        if (!data.createdAt || Object.keys(data.createdAt).length === 0) {
            return false;
        }

        // Try parsing the date
        try {
            const createdDate = new Date(data.createdAt);

            // Check if createdDate is valid
            if (isNaN(createdDate.getTime())) {
                return false;
            }

            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            return createdDate > sevenDaysAgo;
        } catch (error) {
            return false;
        }
    }, [data.createdAt]);

    const renderColors = useMemo(() => {
        const getColors = getTypeOfAttribute(data, 'color');
        if (getColors && getColors.length > 0) {
            return getColors.map((color, index) => (
                <TooltipProvider key={index}>
                    <Tooltip>
                        <TooltipTrigger
                            onClick={() => handlerSwitchColor(color)}
                            aria-label="Select color"
                        >
                            <div className={`w-5 h-5 rounded-full border-[1px] relative flex items-center justify-center ${selectColor === color?.value ? 'border-black' : 'border-[1px]'
                                }`}>
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: color?.colorObject?.hex }}
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-black text-white border-none">
                            <p className='uppercase'>{color.value}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            ));
        }
        return null;
    }, [data, selectColor, handlerSwitchColor]);

    useEffect(() => {
        if (storeData && Object.keys(storeData).length !== 0) {
            setIsEnabledFreeShippingTag(storeData?.productsSettings?.enabledProductFreeShippingTag)
        }
    }, [storeData])

    // Generate unique key for each image
    const getImageKey = useCallback((url) => {
        return url;
    }, []);


    return (
        <div className='group space-y-3'>
            <AspectRatio ratio={9 / 13} className="overflow-hidden relative rounded-3xl">
                {storeData?.offers?.enabledOffer && !salePrice && !data?.isGiftCard && (
                    <div className="absolute transform -rotate-45 bg-black text-white font-bold text-sm py-1 px-5 text-center w-[160px] -left-12 top-3 md:-left-10 md:top-5 z-40">
                        <p className='text-[10px] leading-3'>{storeData?.offers?.parentage}% Off</p>
                        <p className='text-[10px] leading-3 font-normal'>On Checkout</p>
                    </div>
                )}

                <Link href={`/product/${data.titleSlug}`}>
                    <div className={`flex gap-2 items-center absolute top-3 z-20 rounded-3xl ${storeData?.offers?.enabledOffer ? 'right-3' : 'left-3'
                        }`}>
                        {isNew && (
                            <div className='py-1 px-2 bg-[rgba(255,255,255,0.5)] text-black text-[10px] backdrop-blur-md rounded-3xl font-headingFontMedium'>
                                New
                            </div>
                        )}
                        {salePrice && (
                            <div className='py-1 px-2 bg-red-600/30 uppercase tracking-wide text-white text-[10px] backdrop-blur-md rounded-3xl font-bold font-headingFontMedium'>
                                Sale
                            </div>
                        )}
                        {!data?.inStock && (
                            <div className='py-1 px-2 bg-red-600/30 font-semibold text-[10px] backdrop-blur-md rounded-3xl uppercase tracking-wide text-white/75'>
                                Out Of Stock
                            </div>
                        )}
                    </div>

                    <div className={`${!data?.inStock ? 'opacity-50' : ''}`}>
                        <Image
                            src={setImageUrl(mainImage)}
                            alt={data?.titleSlug}
                            width={400}
                            height={600}
                            onClick={handlerClickProduct}
                            loading="lazy"
                            className='md:w-full md:hover:scale-105 md:hover:rotate-1 transition-all ease-in-out cursor-pointer absolute top-0 left-0 w-full h-full object-cover'
                        // unoptimized={true}

                        />

                        {secondMainImage && (
                            <Image
                                src={setImageUrl(secondMainImage)}
                                alt={''}
                                width={400}
                                height={600}
                                onClick={handlerClickProduct}
                                loading="lazy"
                                className='md:w-full md:hover:scale-105 md:hover:rotate-1 transition-all ease-in-out opacity-0 group-hover:opacity-100 absolute top-0 left-0 w-full h-full object-cover delay-150 cursor-pointer'
                            // unoptimized={true}
                            />
                        )}
                    </div>
                </Link>

                {data?.inStock && (
                    <div className='w-full absolute bottom-0 text-xs flex items-center gap-1 md:bottom-[-150px] group-hover:md:bottom-0 transition-all ease-in-out p-2 md:p-5 duration-500'>
                        <QuickViewProducts data={data} />
                    </div>
                )}
            </AspectRatio>

            <div className={`py-2 ${!data?.inStock ? 'opacity-50' : ''}`}>
                {isEnabledFreeShippingTag && <div className='flex items-center py-0 text-[11px] font-semibold text-green-600 gap-2 pb-2'><IconDelivery className="w-4 h-4"/> Free Shipping</div>}
                <div className={`flex items-center gap-1 text-[11px] ${onBlack ? 'text-white/65' : 'text-muted-foreground'} mb-2`}>Code: <span className='font-semibold'>{data.sku}</span></div>
                <Link href={`/product/${data.titleSlug}`}>
                    <h3 className='cursor-pointer text-sm md:text-[14px] font-semibold font-headingFontRegular' onClick={handlerClickProduct}>
                        {data?.title}
                    </h3>
                </Link>

                <Link href={`/product/${data.titleSlug}`} className='mt-2 block'>

                    <div className='flex gap-2 mb-2 cursor-pointer' onClick={handlerClickProduct}>
                        {salePrice && (
                            <div className='text-sm opacity-75 '>
                                <del>{formatPrice(price)}</del>
                            </div>
                        )}
                        <div className='text-sm font-semibold'>
                            {formatPrice(salePrice || price)}
                        </div>
                    </div>
                </Link>

                {/* <div className='mb-2 text-xs opacity-75'>
                    <div className='inline-flex mr-1 text-[10px]'>
                        or 3 installments of {formatPrice((salePrice && salePrice !== 0 ? salePrice : price) / 3)} with
                    </div>
                    <Image
                        src="/images/daraz-koko.png"
                        alt=""
                        width={20}
                        height={80}
                        className='w-auto inline-flex'
                    />
                </div> */}

                <div className='flex gap-1'>
                    {renderColors}
                    {selectColor !== "" && (
                        <Button
                            onClick={handlerClearSelect}
                            variant="link"
                            className="text-xs"
                            aria-label="Clear"
                        >
                            <X className='w-4 h-4 mr-2' />Clear
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}