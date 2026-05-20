import { SiteContext } from '@/app/contexts/siteContexts'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import React, { useContext } from 'react'
import ZoomImage from './zoomImage'
import AutoScrollGallery from './autoScrollGallery'
import useMediaQuery from '@/app/hooks/useMediaQuery'

export default function MainImages({
    product,
    mainImage,
    isLoading,
    imageGallery,
    onChangeThumb,
    isQuickView,
    salePrice
}) {
    const { storeData } = useContext(SiteContext);
    const isDesktop = useMediaQuery("(min-width: 1280px)")

    return (
        <div className={`flex gap-3 relative overflow-hidden ${isQuickView ? 'flex-col' : ''}`}>


            {storeData?.offers?.enabledOffer && !salePrice && <div className="absolute transform -rotate-45 bg-black text-white font-bold text-sm py-1 px-5 text-center w-[160px] -left-10 top-5 z-40">
                {storeData?.offers?.parentage}% Off
                <p className='text-[10px] leading-3 font-normal'>On Checkout</p>
            </div>}

            {isDesktop && !isQuickView ? <AutoScrollGallery
                product={product}
                imageGallery={imageGallery}
                mainImage={mainImage}
                isQuickView={isQuickView}
            /> : <Carousel className="bg-white mb-5 w-full">
                <CarouselContent >
                    {imageGallery.map((img, index) => (
                        <CarouselItem className="" key={index.toString()}>
                            <div className='w-full h-auto overflow-hidden relative'>
                                <img
                                    src={img || 'https://dummyimage.com/200x200/ddd/000'}
                                    width={200}
                                    height={200}
                                    className={`w-full rounded-2xl h-full object-cover cursor-pointer opacity-100`}
                                    alt={''}
                                    // onClick={() => onChangeThumb(img || 'https://dummyimage.com/800x800/ddd/000')}
                                    loading='lazy'
                                    unoptimized={true}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {/* {imageGallery.length > 4 && <> */}
                <CarouselPrevious className="bottom-1/2 left-2" />
                <CarouselNext className="bottom-1/2 right-2" />
                {/* </>} */}
            </Carousel>}



            {/* {isQuickView ? imageGallery && imageGallery.length > 0 && <Carousel className="bg-white mb-5">
                <CarouselContent >
                    {imageGallery.map((img, index) => (
                        <CarouselItem className="basis-1/4" key={index.toString()}>
                            <div className='w-full h-[140px] overflow-hidden relative'>
                                <Image
                                    src={img || 'https://dummyimage.com/200x200/ddd/000'}
                                    width={200}
                                    height={200}
                                    className={`w-full h-full object-cover absolute left-0 top-0 cursor-pointer ${mainImage === img ? 'opacity-100' : 'opacity-50'}`}
                                    alt={''}
                                    onClick={() => onChangeThumb(img || 'https://dummyimage.com/800x800/ddd/000')}
                                    loading='lazy'
                                    unoptimized={true}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                {imageGallery.length > 4 && <>
                    <CarouselPrevious className="bottom-1/2 left-2" />
                    <CarouselNext className="bottom-1/2 right-2" />
                </>}
            </Carousel> : isLoading ? <div className='flex flex-col gap-3'>
                <Skeleton className="w-[90px] h-[150px] rounded-none" />
                <Skeleton className="w-[90px] h-[150px] rounded-none" />
                <Skeleton className="w-[90px] h-[150px] rounded-none" />
                <Skeleton className="w-[90px] h-[150px] rounded-none" />
            </div> : imageGallery && imageGallery.length > 0 && <ScrollArea className="h-auto w-2/12 lg:w-[100px]">
                <div className='flex flex-col gap-3'>
                    {imageGallery.map((img, index) => (
                        <Image
                            key={index.toString()}
                            src={img || 'https://dummyimage.com/800x800/ddd/000'}
                            width={80}
                            height={80}
                            className={`w-auto cursor-pointer ${mainImage === img ? 'opacity-100' : 'opacity-50'}`}
                            alt={''}
                            onClick={() => onChangeThumb(img || 'https://dummyimage.com/800x800/ddd/000')}
                            loading='lazy'
                        />
                    ))}
                </div>
            </ScrollArea>} */}

        </div>
    )
}
