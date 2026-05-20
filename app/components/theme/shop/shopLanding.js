"use client";

import React, { useEffect, useState, useCallback, useRef, useContext } from 'react';
import ProductCard from '@/app/components/theme/cards/productCard';
import ShopFilters from '@/app/components/theme/common/shopFilters';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { apiReq } from '@/lib/common';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Slash, SlidersHorizontal, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SiteContext } from '@/app/contexts/siteContexts';

const ALLOWED_PARAMS = ['category', 'color', 'size', 'material'];

// Utility function to filter URL parameters
const filterAllowedParams = (params) => {
  const filteredParams = {};

  Object.keys(params).forEach(key => {
    if (ALLOWED_PARAMS.includes(key)) {
      filteredParams[key] = params[key];
    }
  });

  return filteredParams;
};

export default function ShopClient({
  initialData,
  customMainTitle = 'Shop',
  isOffers = false
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [visual, setVisual] = useState(4);
  const [products, setProducts] = useState(initialData?.products || []);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState(initialData || []);
  const [allUrlParams, setAllUrlParams] = useState({});
  const [openFilters, setOpenFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(
    initialData?.pagination?.currentPage < initialData?.pagination?.totalPages
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

  const getAllProducts = useCallback(async (filters, pageNum = 1) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      let url = `site/product?delete=false&page=${pageNum}&limit=9`;

      if (isOffers) {
        url = url + `&isSales=true`;
      }

      if (filters) {
        url = url + '&' + filters;
      }

      const res = await apiReq(url, 'GET');

      if (res && res.status === 200) {
        const { data } = await res.json();

        if (pageNum === 1) {
          setProducts(data?.products);
        } else {
          setProducts(prevProducts => [...prevProducts, ...data?.products]);
        }
        setFilters(data);
        setHasMore(data?.pagination?.currentPage < data?.pagination?.totalPages);
      } else {
        if (pageNum === 1) {
          setProducts([]);
          setFilters([]);
        }
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!", {
        description: 'Something went wrong with fetching data, please try again later!',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlerVisualChange = useCallback((col) => {
    setVisual(col);
    localStorage.setItem('viewFormat', col);
  }, []);

  const handlerOnChangeFilter = useCallback((filters) => {
    const paramsObject = {};

    filters.split('&').forEach(param => {
      const [key, value] = param.split('=');
      paramsObject[key] = decodeURIComponent(value);
    });

    setAllUrlParams(paramsObject);
    setPage(1);
    getAllProducts(`${filters}`, 1);
    // router.refresh()
  }, [getAllProducts]);

  const handlerRemoveFilter = useCallback((key) => {
    const newParams = { ...allUrlParams };
    delete newParams[key];
    setAllUrlParams(newParams);

    const queryString = new URLSearchParams(newParams).toString();


    if (queryString) {
      router.push(`/${isOffers ? 'offers' : 'shop'}?${queryString}`);
    } else {
      router.push(`/${isOffers ? 'offers' : 'shop'}`);
    }

    setPage(1);
    getAllProducts(`${queryString}`, 1);

  }, [allUrlParams, router, getAllProducts]);

  useEffect(() => {
    let viewFormat = localStorage.getItem('viewFormat');

    if (!viewFormat) {
      localStorage.setItem('viewFormat', Number(visual));
    }

    setVisual(Number(viewFormat) || 4);

    if (searchParams?.size === 0) {
      setAllUrlParams({})
      getAllProducts(null, 1);
      // Don't fetch initial data as we already have it from props
      // if (!initialData) {
      //   getAllProducts(null, 1);
      // }
    } else {
      const filteredParams = filterAllowedParams(Object.fromEntries(searchParams.entries()));
      const queryString = filteredParams.toString();

      setAllUrlParams(filteredParams);
      if (!initialData) {
        getAllProducts(queryString, 1);
      }
    }
  }, [searchParams, getAllProducts, visual, initialData]);

  useEffect(() => {
    if (page > 1) {
      const queryString = new URLSearchParams(allUrlParams).toString();
      getAllProducts(queryString, page);
    }
  }, [page, allUrlParams, getAllProducts]);

  const renderLoadingSkeleton = () => {
    const skeletons = [];

    for (let index = 0; index < 9; index++) {
      skeletons.push(
        <div key={index} className="flex flex-col space-y-3">
          <Skeleton className="h-[330px] w-full rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px] rounded-2xl" />
            <Skeleton className="h-4 w-[150px] rounded-2xl" />
            <div className='flex items-center gap-3'>
              <Skeleton className="h-4 w-4 rounded-2xl " />
              <Skeleton className="h-4 w-4 rounded-2xl" />
              <Skeleton className="h-4 w-4 rounded-2xl" />
            </div>
          </div>
        </div>
      );
    }

    return skeletons;
  };


  return (
    <div>
      <div className='p-3 relative text-center flex flex-col items-center gap-3'>
        <div className='w-full relative rounded-xl pt-[100px] md:pt-[220px] overflow-hidden'>
          <Image unoptimized={true} src={themeData?.common?.commonInnerBanner || "/images/uptown-shop.webp"} alt='Header image' width={1300} height={400} className='absolute left-0 top-0 w-full h-full object-cover z-0' />
          <div className='absolute bottom-0 left-0 w-full h-full bg-black/20'></div>
          <div className='absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-black/[0.67] to-[#ff6e02]/0'></div>
          <div className='relative z-10 px-[9.5vw]'>
            <h1 className='text-2xl font-headingFontExtraBold uppercase mb-2 text-white'>{customMainTitle}</h1>
            <div className='border-t-[1px] border-t-white/25 flex items-center justify-center pt-3'>
              <Breadcrumb className="pb-10 text-white font-headingFontMedium">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <Link href="/" className='text-white text-xs font-headingFontMedium uppercase'>Home</Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator>
                    <ChevronRight className='text-white' />
                  </BreadcrumbSeparator>
                  <BreadcrumbItem className='text-white/55 text-xs font-headingFontMedium uppercase'>
                    {customMainTitle}
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </div>

      <div className='xl:px-[9.5vw] mx-auto my-5 min-h-[40vh] relative'>


        <div className='flex gap-5 flex-col xl:flex-row'>
          <div className='hidden xl:block xl:w-3/12 p-4 xl:p-0'>
            <ShopFilters data={filters} onChangeFilter={handlerOnChangeFilter} />
          </div>
          <div className='w-full xl:w-9/12 p-4 xl:p-0'>
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

            <div className={`grid grid-cols-2 md:grid-cols-${visual} lg:grid-cols-${visual} gap-5 lg:p-0 xl:p-0`}>
              {products?.map((product, index) => (
                <div key={`${product._id}-${index}-${new Date()}`} ref={index === products.length - 1 ? lastProductElementRef : null}>
                  <ProductCard data={product} />
                </div>
              ))}


              {isLoading && renderLoadingSkeleton()}
            </div>
          </div>
        </div>
      </div>

      <Sheet open={openFilters} onOpenChange={() => setOpenFilters(false)}>
        <SheetContent side="left" className="rounded-tr-2xl rounded-br-2xl bg-white/80 backdrop-blur-lg border-0">
          <SheetHeader>
            <SheetTitle className="text-left flex items-center gap-3 ">
              <SlidersHorizontal className='w-4 h-4' />
              Filter
            </SheetTitle>
            <SheetDescription className="text-left flex flex-col items-start justify-start text-black p-0 ">
              <div className='max-h-[90vh] overflow-y-auto w-full'>
                <ShopFilters data={filters} onChangeFilter={handlerOnChangeFilter} />
              </div>
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </div>
  );
}