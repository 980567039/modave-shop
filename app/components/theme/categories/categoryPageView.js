"use client";

import React, { useCallback, useEffect, useState, useRef, useContext } from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { apiReq } from '@/lib/common';
import { ChevronDown, ChevronRight, Slash, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ShopFilters from '../common/shopFilters';
import { Button } from '@/components/ui/button';
import ProductCard from '../cards/productCard';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import Image from 'next/image';
import { SiteContext } from '@/app/contexts/siteContexts';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';


const ALLOWED_PARAMS = ['category', 'color', 'size', 'material'];

// Utility function to filter URL parameters
const filterAllowedParams = (params) => {
    const filteredParams = {};
    Object.keys(params).forEach(key => {
        if (ALLOWED_PARAMS.includes(key.toLowerCase())) {
            filteredParams[key] = params[key];
        }
    });
    return filteredParams;
};



export default function CategoryPageView({ categorySlug, initialData, searchParams, hideFilters, isSubcategory, subCategoryName }) {
    const router = useRouter();
    const [visual, setVisual] = useState(4);
    const [products, setProducts] = useState(initialData.products);
    const [isLoading, setIsLoading] = useState(false);
    const [openFilters, setOpenFilters] = useState(false);
    const [filters, setFilters] = useState(initialData.filters);
    const [allUrlParams, setAllUrlParams] = useState(filterAllowedParams(searchParams || {}));
    const [breadcrumbTitle, setBreadcrumbTitle] = useState(initialData.selectedCategory);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(
        initialData.pagination?.currentPage < initialData.pagination?.totalPages
    );

    const { themeData } = useContext(SiteContext);


    const observer = useRef();
    const lastProductElementRef = useCallback(node => {
        if (isLoading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        });
        if (node) observer.current.observe(node);
    }, [isLoading, hasMore]);

    const handlerVisualChange = useCallback((col) => {
        setVisual(col);
        localStorage.setItem('viewFormat', col);
    }, []);

    const getCategoryRelatedProducts = useCallback(async (currentFilters, pageNum = 1) => {
        try {
            setIsLoading(true);
            let url = `site/product?delete=false&inCategoryLevel=true&baseCategory=${categorySlug}&page=${pageNum}&limit=12`;

            // Only include allowed parameters in the API request
            const filteredParams = filterAllowedParams(currentFilters);
            const filterString = new URLSearchParams(filteredParams).toString();
            if (filterString) {
                url += `&${filterString}`;
            }

            const res = await apiReq(url, 'GET');

            if (res?.status === 200) {
                const { data } = await res.json();

                if (pageNum === 1) {
                    setProducts(data?.products);
                } else {
                    setProducts(prevProducts => [...prevProducts, ...data?.products]);
                }
                setFilters(data);
                setBreadcrumbTitle(data?.selectedCategory);
                setHasMore(data?.pagination?.currentPage < data?.pagination?.totalPages);
            } else {
                if (pageNum === 1) {
                    setProducts([]);
                    setFilters({});
                    setBreadcrumbTitle('');
                }
                setHasMore(false);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong!", {
                description: 'Something went wrong with fetching data, please try again later!',
            });
        } finally {
            setIsLoading(false);
        }



    }, [categorySlug]);

    const handlerOnChangeFilter = useCallback((newFilters) => {
        let updatedFilters = { ...allUrlParams };

        if (typeof newFilters === 'string') {
            newFilters.split('&').forEach(param => {
                const [key, value] = param.split('=');
                if (ALLOWED_PARAMS.includes(key.toLowerCase())) {
                    updatedFilters[key] = decodeURIComponent(value);
                }
            });
        } else if (typeof newFilters === 'object') {
            // Only include allowed parameters
            Object.keys(newFilters).forEach(key => {
                if (ALLOWED_PARAMS.includes(key.toLowerCase())) {
                    updatedFilters[key] = newFilters[key];
                }
            });
        }

        setAllUrlParams(updatedFilters);
        setPage(1);

        // Update URL with new filters
        const queryString = new URLSearchParams(updatedFilters).toString();

        if (isSubcategory) {
            router.push(`/shop/category/${subCategoryName}/${categorySlug}${queryString ? `?${queryString}` : ''}`);
        } else {
            router.push(`/shop/category/${categorySlug}${queryString ? `?${queryString}` : ''}`);
        }
        getCategoryRelatedProducts(updatedFilters, 1);
    }, [allUrlParams, categorySlug, getCategoryRelatedProducts, router]);

    const handlerRemoveFilter = useCallback((key) => {
        // Only remove if it's an allowed parameter
        if (!ALLOWED_PARAMS.includes(key.toLowerCase())) return;

        const updatedFilters = { ...allUrlParams };
        delete updatedFilters[key];

        const queryString = new URLSearchParams(updatedFilters).toString();

        if (isSubcategory) {
            router.push(`/shop/category/${subCategoryName}/${categorySlug}${queryString ? `?${queryString}` : ''}`);
        } else {
            router.push(`/shop/category/${categorySlug}${queryString ? `?${queryString}` : ''}`);
        }

        if (!queryString) {
            setFilters({});
        }

        setPage(1);
        getCategoryRelatedProducts(updatedFilters, 1);
        setAllUrlParams(updatedFilters);
    }, [allUrlParams, categorySlug, getCategoryRelatedProducts, router]);

    const renderLoadingSkeleton = () => {
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
    };

    useEffect(() => {
        const viewFormat = localStorage.getItem('viewFormat');
        setVisual(Number(viewFormat) || 4);
    }, []);

    useEffect(() => {

        // router.refresh();

        if (page > 1) {
            getCategoryRelatedProducts(allUrlParams, page);
        }
    }, [page, allUrlParams, getCategoryRelatedProducts]);


    return (
        <div>
            <div className='p-3 relative text-center flex flex-col items-center gap-3'>
                <div className='w-full relative rounded-xl pt-[100px] md:pt-[220px] overflow-hidden '>
                    {(initialData?.filters?.categoryImage || themeData?.common?.commonInnerBanner) && <Image unoptimized={true} src={(initialData?.filters?.categoryImage || themeData?.common?.commonInnerBanner) || "/images/uptown-shop.webp"} alt={initialData?.filters?.categoryCustomTitle || 'Header image'} width={1300} height={400} className='absolute left-0 top-0 w-full h-full object-cover z-0' />}
                    <div className='absolute bottom-0 left-0 w-full h-full bg-black/20'></div>
                    <div className='absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-black/[0.67] to-[#ff6e02]/0'></div>
                    <div className='relative z-10 px-[9.5vw]'>
                        <h1 className='text-2xl font-headingFontExtraBold uppercase mb-2 text-white'>{initialData?.filters?.categoryCustomTitle || 'Shop'}</h1>
                        <p className='pb-3 text-white md:max-w-[60%] mx-auto text-xs'>{initialData?.filters?.categoryDescription}</p>
                        <div className='border-t-[1px] border-t-white/25 flex items-center justify-center pt-3'>
                            <Breadcrumb className="pb-10 text-white font-headingFontMedium">
                                <BreadcrumbList>
                                    <BreadcrumbItem>
                                        <Link href="/" className='text-white text-xs font-headingFontMedium uppercase'>Home</Link>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator>
                                        <ChevronRight className='text-white' />
                                    </BreadcrumbSeparator>
                                    <BreadcrumbItem>
                                        <Link href="/shop" className='text-white text-xs font-headingFontMedium uppercase'>Shop</Link>
                                    </BreadcrumbItem>
                                    {breadcrumbTitle !== '' && <>
                                        <BreadcrumbSeparator>
                                            <ChevronRight className='text-white' />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem >
                                            <Link href="/shop/categories" className='text-white text-xs font-headingFontMedium uppercase'>Categories</Link>
                                        </BreadcrumbItem>
                                        {isSubcategory && subCategoryName &&
                                            <>
                                                <BreadcrumbSeparator>
                                                    <ChevronRight className='text-white' />
                                                </BreadcrumbSeparator>
                                                <BreadcrumbItem>
                                                    <Link href={`/shop/category/${subCategoryName}`} className='text-white text-xs font-headingFontMedium uppercase'>{subCategoryName.replace('-', '')}</Link>
                                                </BreadcrumbItem>
                                            </>
                                        }
                                        <BreadcrumbSeparator>
                                            <ChevronRight className='text-white' />
                                        </BreadcrumbSeparator>
                                        <BreadcrumbItem className='text-white/55 text-xs font-headingFontMedium uppercase'>
                                            {breadcrumbTitle}
                                        </BreadcrumbItem>
                                    </>}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </div>
                </div>
            </div>

            <div className='xl:px-[9.5vw] mx-auto my-5 min-h-[40vh] relative'>
                <div className='flex gap-5 flex-col xl:flex-row'>
                    <div className='hidden xl:block xl:w-3/12 p-4 xl:p-0'>
                        <ShopFilters data={filters} onChangeFilter={handlerOnChangeFilter} categorySlug={categorySlug} hide={{ category: hideFilters }} />
                    </div>
                    <div className={`w-full xl:w-9/12 p-4 xl:p-0`}>
                        <div className='w-full flex items-center gap-3 px-0 justify-between border-t-[1px] border-b-[1px] border-t-black/10 border-b-black/10 mb-5'>
                            <div onClick={() => setOpenFilters(true)} className='flex gap-1 items-center xl:hidden py-2'>
                                <SlidersHorizontal className='w-4 h-4' />
                                <span className='block text-sm'>Filter</span>
                            </div>
                            <div className='flex items-center gap-3 justify-between w-full'>
                                <div className='lg:px-0'>
                                    {allUrlParams && Object.keys(allUrlParams).length !== 0 && (
                                        <div className='flex gap-3 items-center'>
                                            {Object.keys(allUrlParams).map((key) => (
                                                <div className='flex gap-1 px-2 py-1 text-xs rounded-full bg-black/10' key={key}>
                                                    <span className='capitalize font-bold text-black '>{allUrlParams[key].replace('-', ' ')}</span>
                                                    <button onClick={() => handlerRemoveFilter(key)} className='bg-black rounded-full w-[15px] h-[15px] flex items-center justify-center p-0'><X className='w-3 h-3 text-white' /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className='flex justify-end gap-2'>
                                    <div className='hidden md:flex gap-2'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className='flex items-center gap-2 justify-between text-xs font-headingFontMedium uppercase py-4 border-l-[1px] px-4 pr-0'>
                                                <span>Select layout</span>
                                                <ChevronDown size={10} />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="rounded-2xl shadow-2xl p-3">
                                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer rounded-xl" onClick={() => handlerVisualChange(2)}>
                                                    <Button

                                                        variant="outline"
                                                        className={cn(
                                                            "flex gap-1 p-1 rounded-lg h-[30px]",
                                                            visual === 2 ? 'border-black' : ''
                                                        )}>
                                                        <div className='w-2 h-full bg-black rounded-lg' />
                                                        <div className='w-2 h-full bg-black rounded-lg' />
                                                    </Button>
                                                    <p className='text-xs uppercase font-headingFontMedium'>Two layout</p>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer rounded-xl" onClick={() => handlerVisualChange(3)}>
                                                    <Button

                                                        variant="outline"
                                                        className={cn(
                                                            "flex gap-1 p-1 rounded-lg h-[30px] ",
                                                            visual === 3 ? 'border-black' : ''
                                                        )}>
                                                        <div className='w-2 h-full bg-black rounded-lg' />
                                                        <div className='w-2 h-full bg-black rounded-lg' />
                                                        <div className='w-2 h-full bg-black rounded-lg' />
                                                    </Button>
                                                    <p className='text-xs uppercase font-headingFontMedium'>Three layout</p>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer rounded-xl" onClick={() => handlerVisualChange(4)}>
                                                    <Button

                                                        variant="outline"
                                                        className={cn(
                                                            "flex gap-1 p-1 rounded-lg h-[30px]",
                                                            visual === 4 ? 'border-black' : ''
                                                        )}>
                                                        <div className='w-2 h-full bg-black rounded-lg' />
                                                        <div className='w-2 h-full bg-black rounded-lg' />
                                                        <div className='w-2 h-full bg-black rounded-lg' />
                                                        <div className='w-2 h-full bg-black rounded-lg' />
                                                    </Button>
                                                    <p className='text-xs uppercase font-headingFontMedium'>Four layout</p>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {!isLoading && !products.length && <div className='flex flex-col gap-3 items-center justify-center'>
                            <Image unoptimized={true} alt="no product" src="/images/no-products.svg" className="max-w-[200px] mx-auto mb-3" width={200} height={250} />
                            <h4 className='text-muted-foreground'>No Products Found!</h4>
                        </div>}

                        <div className={`grid grid-cols-2 md:grid-cols-${visual} lg:grid-cols-${visual} gap-5 lg:p-5 xl:p-0`}>
                            {products?.map((product, index) => (
                                <div key={product._id} ref={index === products.length - 1 ? lastProductElementRef : null}>
                                    <ProductCard data={product} />
                                </div>
                            ))}
                            {isLoading && renderLoadingSkeleton()}
                        </div>
                    </div>
                </div>
            </div>

            <Sheet open={openFilters} onOpenChange={() => setOpenFilters(false)}>
                <SheetContent side="left">
                    <SheetHeader>
                        <SheetTitle className="text-left flex items-center gap-3">
                            <SlidersHorizontal className='w-4 h-4' />
                            Filter
                        </SheetTitle>
                        <SheetDescription className="text-left flex flex-col items-start justify-start text-black p-0">
                            <div className='max-h-[90vh] overflow-y-auto w-full'>
                                <ShopFilters data={filters} onChangeFilter={handlerOnChangeFilter} />
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>
        </div>
    )
}