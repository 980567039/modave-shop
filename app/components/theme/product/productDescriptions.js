"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatPrice, getTypeOfAttribute, onlyFirstLetter } from "@/lib/common";
import { Share2, X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import QuantityChanger from "../cart/quantityChanger";
import AddToCart from "../common/addToCart";
import Link from "next/link";
import { IconDelivery, IconFacebook, IconLinkend, IconSMS, IconWhatsapp, IconX } from "../../svgIcons";
import MainImages from "./mainImages";
import RelatedProducts from "./relatedProducts";
import { SizeChart } from "./sizeChart";
import ProductJsonLd from "./productJsonLd";
import moment from "moment";
// import { trackViewContent } from "@/lib/facebook-conversion-api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SiteContext } from "@/app/contexts/siteContexts";


export default function ProductDescriptions({ params, host, initialData, relatedProducts, quickView = false }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();


    // Initialize all state with initialData
    const [price, setPrice] = useState(initialData?.price || '');
    const [salePrice, setSalePrice] = useState(initialData?.salePrice || '');
    const [mainImage, setMainImage] = useState(initialData?.defaultImage?.url || '');
    const [product, setProduct] = useState(initialData || {});
    const [availableStock, setAvailableStock] = useState('');
    const [isLoading, setIsLoading] = useState(!initialData);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [availableSizes, setAvailableSizes] = useState([]);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isEnabledFreeShippingTag, setIsEnabledFreeShippingTag] = useState(false);
    const [quantity, setQuantity] = useState(1);

    const { storeData } = useContext(SiteContext);

    const [imageGallery, setImageGallery] = useState(() => {
        if (!initialData) return [];

        const galleryImages = initialData.imageGallery.map((item) => item?.url);

        if (initialData.attributes && initialData.attributes.length > 0) {
            const gallImages = initialData.attributes?.map((item) => item?.image).filter((item) => item !== false);
            const allImages = [initialData?.defaultImage?.url, ...galleryImages, ...gallImages];
            return [...new Set(allImages)].filter(url => url !== null);
        }

        const allImages = [initialData?.defaultImage?.url, ...galleryImages];
        return [...new Set(allImages)].filter(url => url !== null);
    });


    const fullUrl = `https://${host}${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;



    const getProductByColorAndSize = useCallback((attr, color, size) => {
        return attr.filter(product =>
            product.attributes.color.value === color &&
            product.attributes.size.value === size
        );
    }, []);

    const initializeData = useCallback((item) => {

        if (item && item?.attributes && item?.attributes.length > 0) {
            const firstColors = getTypeOfAttribute(item, 'color') ? getTypeOfAttribute(item, 'color')[0].value : '';

            const getInitValues = item?.attributes?.filter(product =>
                product.attributes.color.value === firstColors
            );

            if (firstColors !== '') {
                setSelectedColor(firstColors);
            }


            if (getInitValues) {
                const getSizes = getInitValues.map((attr) => ({
                    stock: attr.stock || false,
                    value: attr.attributes.size.value
                }));

                const getAvailableImage = getProductByColorAndSize(
                    item?.attributes,
                    firstColors,
                    getSizes.find((d) => d.stock !== false)?.value
                );

                setAvailableSizes(getSizes);
                setSelectedSize(getSizes.find((d) => d.stock !== false)?.value);
                setAvailableStock(getAvailableImage[0]?.stock);
                setPrice(!getInitValues[0]?.price ? item?.price : getInitValues[0]?.price);
                // setMainImage(getAvailableImage[0]?.image || item?.defaultImage?.url);
            }
        } else {
            setAvailableStock(Number(item?.stock));
        }
    }, [getProductByColorAndSize]);

    const handlerChangeColor = useCallback((color) => {
        const getInitValues = product?.attributes?.filter(product =>
            product.attributes.color.value === color?.value
        );

        if (getInitValues[0]) {
            const getSizes = getInitValues.map((attr) => ({
                stock: attr.stock || false,
                value: attr.attributes.size.value
            }));

            const getAvailableAttr = getProductByColorAndSize(
                product?.attributes,
                color?.value,
                getSizes.find((d) => d.stock !== false)?.value
            );

            setSelectedColor(getInitValues[0]?.attributes?.color?.value);
            setSelectedSize(getSizes.find((d) => d.stock !== false)?.value);
            setAvailableStock(getAvailableAttr[0]?.stock);
            setPrice(getAvailableAttr[0]?.price || product.price);
            setMainImage(getAvailableAttr[0]?.image || product?.defaultImage?.url);
            setAvailableSizes(getSizes);
        }
    }, [product, getProductByColorAndSize]);

    const handlerChangeSize = useCallback((size) => {
        const getInitValues = getProductByColorAndSize(product?.attributes, selectedColor, size.value);

        if (getInitValues) {
            setSelectedSize(size.value);
            setPrice(getInitValues[0]?.price || product.price);
            setAvailableStock(getInitValues[0]?.stock);
            setMainImage(getInitValues[0]?.image || product?.defaultImage?.url);
        }
    }, [product?.attributes, selectedColor, getProductByColorAndSize]);

    const renderLoadingSkeleton = useCallback(() => {
        const skeletons = [];
        for (let index = 0; index < 12; index++) {
            skeletons.push(
                <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-[330px] w-full rounded-none" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px] rounded-none" />
                        <Skeleton className="h-4 w-[150px] rounded-none" />
                        <div className='flex items-center gap-3'>
                            <Skeleton className="h-4 w-4 rounded-none" />
                            <Skeleton className="h-4 w-4 rounded-none" />
                            <Skeleton className="h-4 w-4 rounded-none" />
                        </div>
                    </div>
                </div>
            );
        }
        return skeletons;
    }, []);

    // Handle initial data setup
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setProduct(initialData);
            setPrice(initialData.price);
            setSalePrice(initialData.salePrice);
            setMainImage(initialData.defaultImage?.url);
            setIsLoading(false);
        }
    }, [initialData]);

    // Initialize product data when product state changes
    useEffect(() => {
        if (product && Object.keys(product).length > 0) {
            initializeData(product);
            // trackViewContent({
            //     productId: product._id,
            //     value: product.salesPrice || product.price,
            //     currency: 'LKR',
            //     user: {},
            //     category: product?.category?.map((d) => d.title) || ''
            // }).catch(console.error);
        }
    }, [product, initializeData]);

    // Add product to recently viewed
    useEffect(() => {
        if (product?._id && !quickView) {
            const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            const isProductExists = recentlyViewed.find(item => item._id === product._id);

            if (!isProductExists) {
                const updatedRecentlyViewed = [
                    {
                        _id: product._id,
                        title: product.title,
                        slug: product.slug,
                        price: product.price,
                        salePrice: product.salePrice,
                        defaultImage: product.defaultImage,
                        inStock: product.inStock
                    },
                    ...recentlyViewed
                ].slice(0, 4); // Keep only the last 4 items

                localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecentlyViewed));
            }
        }
    }, [product, quickView]);

    useEffect(() => {
        if (storeData && Object.keys(storeData).length !== 0) {
            setIsEnabledFreeShippingTag(storeData?.productsSettings?.enabledProductFreeShippingTag)
        }
    }, [storeData])


    const productJtd = {
        name: product?.title || '',
        description: product?.description || '',
        sku: product?.sku || '',
        gtin13: "0123456789013",
        brand: "Nuvie Clothing",
        images: [
            mainImage,
            ...imageGallery
        ],
        offers: {
            price: salePrice && salePrice !== 0 && salePrice !== "" ? salePrice : price,
            priceCurrency: "LKR",
            priceValidUntil: moment(product?.createdAt).add(7, 'days').format('YYYY-MM-DD'),
            url: `${host}/product/${product?.titleSlug}`,
            seller: "Nuvie Clothing Official Store"
        },
        aggregateRating: {
            ratingValue: 4.8,
            reviewCount: 123
        },
        review: {
            authorName: "",
            ratingValue: 5,
            bestRating: 5
        }
    };


    return (
        <div>
            <ProductJsonLd {...productJtd} />

            <div className="absolute top-0 left-0 w-full h-[110px] xl:h-20 bg-black rounded-bl-2xl rounded-br-2xl"></div>
            {!quickView && <div className='pt-[100px] lg:pt-[95px] relative text-center flex flex-col items-center gap-3'></div>}

            <div className={`w-auto mx-auto ${!quickView ? 'my-5' : ''}`}>
                <div className={`flex flex-col lg:gap-10 relative ${!quickView ? 'mb:10 lg:mb-24' : ''}`}>
                    <div className={`w-full ${!quickView ? 'max-xl:xl:p-4' : ''} xl:p-0`}>
                        <MainImages
                            product={product}
                            mainImage={mainImage}
                            imageGallery={imageGallery}
                            isLoading={isLoading}
                            onChangeThumb={(d) => setMainImage(d)}
                            isQuickView={quickView}
                            salePrice={salePrice}
                        />
                    </div>

                    <div className={`
                        relative
                        xl:absolute 
                        z-10 
                        xl:bottom-7 
                        xl:right-[9.5vw]
                        xl:bg-black/45 
                        xl:border-[1px] 
                        xl:rounded-2xl 
                        xl:border-white/20 
                        xl:p-10
                        px-5 
                        xl:backdrop-blur-xl 
                        xl:max-w-[400px]
                        xl:text-white
                        text-black
                        `}>

                        <DropdownMenu>
                            <DropdownMenuTrigger className="absolute right-3 top-3 w-[30px] h-[30px] rounded-full bg-black/30 flex items-center justify-center">
                                <Share2 size={13} />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="rounded-2xl shadow-md border-0 p-3 bg-black/50 text-white backdrop-blur font-headingFontRegular tracking-wide" side="bottom" align="end">
                                <Link
                                    href={`https://www.facebook.com/sharer/sharer.php?u=${fullUrl}`}
                                    target="_blank"
                                    className="flex rounded-3xl items-center gap-2 text-sm p-2 transition-all ease-in-out hover:bg-white/20">
                                    <IconFacebook className="w-4 h-4" />Share on facebook
                                </Link>
                                <Link
                                    href={`https://wa.me/?text=Hey check this out ${fullUrl}`}
                                    target="_blank"
                                    className="flex rounded-3xl items-center gap-2 text-sm p-2 transition-all ease-in-out hover:bg-white/20">
                                    <IconWhatsapp className="w-4 h-4" />Share on whatsapp
                                </Link>
                                <Link
                                    href={`https://twitter.com/intent/tweet?text=Hey check this out ${fullUrl}`}
                                    target="_blank"
                                    className="flex rounded-3xl items-center gap-2 text-sm p-2 transition-all ease-in-out hover:bg-white/20">
                                    <IconX className="w-4 h-4" />Share on X
                                </Link>
                                <Link
                                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${fullUrl}`}
                                    target="_blank"
                                    className="flex rounded-3xl items-center gap-2 text-sm p-2 transition-all ease-in-out hover:bg-white/20">
                                    <IconLinkend className="w-4 h-4" />Share on Linkedin
                                </Link>
                                <Link
                                    href={`sms:?body=Hey check this out ${fullUrl}`}
                                    target="_blank"
                                    className="flex rounded-3xl items-center gap-2 text-sm p-2 transition-all ease-in-out hover:bg-white/20">
                                    <IconSMS className="w-4 h-4" />Share via SMS
                                </Link>
                            </DropdownMenuContent>
                        </DropdownMenu>


                        <div className='space-y-3'>
                            <div className="flex items-center gap-2 text-[10px]">
                                {isLoading ? <Skeleton className="w-20 h-2 rounded-none" /> : product?.sku && <div className='flex gap-3 items-center'>CODE: {product.sku}</div>}
                                {isLoading ? <Skeleton className="w-[40%] h-2 rounded-none" /> : <div className='text-bold flex items-center gap-3'><div className={`${product?.inStock ? 'text-green-500' : 'text-red-500'}`}>{product?.inStock ? 'In Stock' : 'Out Of Stock'}</div></div>}
                            </div>
                            {isLoading ? <Skeleton className="w-full h-[20px] rounded-none" /> : <h1 className='text-xl font-semibold font-headingFontMedium'>{product.title}</h1>}
                            {isEnabledFreeShippingTag && <>
                                <div className='flex items-center py-0 text-[11px] font-semibold text-green-500 gap-2'><IconDelivery className="w-3 h-3"  />Free Shipping</div>
                            </>
                            }
                            {isLoading ? (
                                <div className='flex flex-col gap-2'>
                                    <Skeleton className="w-full h-[10px] rounded-none" />
                                    <Skeleton className="w-[80%] h-[10px] rounded-none" />
                                </div>
                            ) : product?.description && (
                                <div className='xl:text-xs xl:text-white/80'>
                                    {product?.description.length > 100 ? (
                                        <div className="inline-block">
                                            <p className="left">
                                                {showFullDescription
                                                    ? product.description
                                                    : `${product.description.substring(0, 100)}...`}
                                            </p>
                                            <button
                                                onClick={() => setShowFullDescription(!showFullDescription)}
                                                className="xl:text-[10px]  underline mt-1"
                                            >
                                                {showFullDescription ? 'Read Less' : 'Read More'}
                                            </button>
                                        </div>
                                    ) : (
                                        <p>{product.description}</p>
                                    )}
                                </div>
                            )}

                            <div className='flex gap-3 flex-col border-b-[1px] border-b-white/30 pb-5'>
                                <div className='flex items-center text-base gap-3 '>
                                    {isLoading ? <Skeleton className="w-3/12 h-[30px] rounded-none" /> : salePrice && salePrice !== 0 ? <del className='xl:text-white/60 font-light xl:text-sm' aria-hidden="true"><bdi>{formatPrice(price)}</bdi></del> : null}

                                    {isLoading ? <Skeleton className="w-3/12 h-[30px] rounded-none" /> : <div className='font-semibold xl:text-sm'>
                                        {formatPrice(salePrice && salePrice !== 0 && salePrice !== "" ? salePrice : price)}
                                    </div>}
                                </div>
                                {/* {isLoading ? <Skeleton className="w-10/12 h-[10px] rounded-none" /> : <div className='xl:text-white/95 flex gap-2 items-center text-sm xl:text-[10px]'>
                                    or 3 installments of {formatPrice((salePrice && salePrice !== 0 ? salePrice : price) / 3)} with <Image src="/images/daraz-koko.png" alt="" width={35} height={80} className='w-auto' />
                                </div>} */}
                            </div>


                            {isLoading ?
                                <div className='flex flex-col gap-3'>
                                    <Skeleton className="w-[20%] h-[15px] rounded-none" />
                                    <div className='flex gap-3'>
                                        <Skeleton className="w-6 h-6 rounded-none" />
                                        <Skeleton className="w-6 h-6 rounded-none" />
                                    </div>
                                </div>
                                : getTypeOfAttribute(product, 'color') && getTypeOfAttribute(product, 'color').length > 0 && getTypeOfAttribute(product, 'color').every(item => item !== "") && <div className='flex gap-1 flex-col border-b-[1px] border-white/35 pb-4'>
                                    <h3 className='text-sm xl:text-[12px] font-semibold'>Color: <span className='font-light capitalize'>{selectedColor || 'Select a color'}</span></h3>
                                    <div className='flex gap-2 items-center'>
                                        {getTypeOfAttribute(product, 'color').map((color, index) => (
                                            <TooltipProvider key={index}>
                                                <Tooltip>
                                                    <TooltipTrigger onClick={() => handlerChangeColor(color)} key={index.toString()} className={`p-1 w-6 h-6 rounded-full border-[1px] ${selectedColor === color.value ? 'border-black/30 xl:border-white/30' : ''}`}>
                                                        <div className='w-full h-full rounded-full' style={{
                                                            backgroundColor: color?.colorObject?.hex || ''
                                                        }} />
                                                    </TooltipTrigger>
                                                    <TooltipContent className="bg-black/45 rounded-xl text-white border-none backdrop-blur-lg text-xs">
                                                        <p className='capitalize'>{color.value}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        ))}
                                    </div>
                                </div>}


                            {isLoading ? <div className='flex flex-col gap-3'>
                                <Skeleton className="w-[20%] h-[15px] rounded-none" />
                                <div className='flex gap-3'>
                                    <Skeleton className="w-8 h-8 rounded-none" />
                                    <Skeleton className="w-8 h-8 rounded-none" />
                                </div>
                            </div> : getTypeOfAttribute(product, 'size') && getTypeOfAttribute(product, 'size').length > 0 && getTypeOfAttribute(product, 'size').every(item => item !== "") && <div className='flex gap-1 flex-col'>
                                <div className="flex gap-3 items-center justify-between">
                                    <h3 className='text-sm xl:text-[12px] font-semibold'>Size: <span className='font-light capitalize'>{selectedSize || 'Select a size'}</span></h3>
                                    {isLoading ? <Skeleton className="w-[20%] h-2 rounded-none" /> : <div className="flex ">
                                        <SizeChart data={product} />
                                    </div>}
                                </div>
                                <div className='flex gap-2 flex-wrap items-center'>

                                    {getTypeOfAttribute(product, 'size')?.map((size, i) => {
                                        const findStock = availableSizes.find(d => d.value === size.value && d.stock !== false);

                                        const isDisabled = findStock?.stock && Number(findStock?.stock);
                                        
                                        return size !== "" && (
                                            <Button
                                                onClick={() => handlerChangeSize(size)}
                                                key={i.toString()}
                                                className={`p-1 rounded-full border-[1px] w-[40px] h-[40px] uppercase ${selectedSize === size.value ? 'border-black bg-black text-white ' : 'border-black/35 xl:border-white/35'} relative`}
                                                disabled={!isDisabled}
                                                variant="ghost"
                                            >
                                                <div className='p-1 text-[10px]'>{onlyFirstLetter(size.value) === "free Size" ? 'Free' : onlyFirstLetter(size.value)}</div>
                                                {!isDisabled && <X className='absolute left-[50%] top-[50%] z-10 -translate-x-[50%] -translate-y-[50%] text-red-500' />}
                                            </Button>
                                        );
                                    })}

                                </div>
                            </div>}

                            {isLoading ? <Skeleton className="w-20 h-2 rounded-none" /> : availableStock && <div className='flex gap-2 items-center text-white text-sm xl:text-[10px]'>Stock Items:<span className="text-white/60">{availableStock} item{availableStock > 1 ? 's' : ""} in stock</span></div>}

                            {product?.inStock && <div className={`flex gap-3 items-center justify-between w-full ${!quickView ? '' : ''} lg:bg-white  rounded-full xl:p-2 text-white`}>
                                {isLoading ? <Skeleton className="w-28 h-10 rounded-none" /> :
                                    product?.inStock && <QuantityChanger initValue={1} maxCount={availableStock} onQuantityChange={(d) => setQuantity(Number(d))} />}
                                {isLoading ? <Skeleton className="w-28 h-10 rounded-none" /> :
                                    product?.inStock && <AddToCart
                                        classes="w-full lg:w-auto"
                                        product={{
                                            ...product,
                                            mainImage,
                                            selectedColor,
                                            selectedSize,
                                            availableStock,
                                            price: salePrice && salePrice !== 0 ? salePrice : price
                                        }} quantity={quantity} />
                                }
                                {/* <Button className="rounded-none px-10"><ShoppingBasket className='mr-2 w-4 h-4' />Buy Now</Button> */}
                            </div>}

                            {!quickView && <>
                                <div className='flex items-center gap-5'>
                                    {isLoading ? <Skeleton className="w-[60%] h-2 rounded-none" /> : product?.modelInfo && <p className='text-sm xl:text-[10px]'>{product?.modelInfo}</p>}
                                    {/* <Link href="/" className="hover:underline text-sm underline-offset-4">Delivery & Return</Link> */}
                                </div>

                                <div>
                                    {isLoading ?
                                        <div className='flex flex-col gap-2'>
                                            <Skeleton className="w-[60%] h-2 rounded-none" />
                                            <Skeleton className="w-[40%] h-2 rounded-none" />
                                            <Skeleton className="w-[55%] h-2 rounded-none" />
                                        </div>
                                        : <ul className='pl-4 xl:pl-3 list-disc text-sm xl:text-[10px]'>
                                            {product?.material && Object.keys(product?.material).length !== 0 && <li>Material : <span className="text-black/60 xl:text-white/60">{product?.material?.title}</span></li>}
                                            {product.materialComposition && <li>Material Composition : <span className="text-black/60 xl:text-white/60">{product.materialComposition}</span></li>}
                                        </ul>}

                                </div>

                                <div className='text-sm '>
                                    {isLoading ?
                                        <div className='flex items-center gap-2 mt-3'>
                                            <Skeleton className="w-[20%] h-2 rounded-none" />
                                            <Skeleton className="w-[30%] h-2 rounded-none" />
                                        </div>
                                        : product?.category && product?.category.length > 0 && <div className='text-xs xl:text-[10px] flex items-start gap-3 xl:text-white'>
                                            Categories:
                                            <div className='flex items-center gap-2 flex-shrink flex-wrap'>
                                                {product?.category.map((cat, i) => (
                                                    <Link key={i.toString()} href={`/shop/category/${cat.slug}`} className='underline underline-offset-2 text-black/60 xl:text-white/60'>{cat.title}</Link>
                                                ))}
                                            </div>
                                        </div>}
                                </div>
                            </>}
                        </div>
                    </div>
                </div>

                {!quickView && <>

                    <RelatedProducts categories={product?.category} product={relatedProducts} />

                    {/* <RecentlyViewedProducts /> */}
                </>}


            </div>

        </div>
    )
}
