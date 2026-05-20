import React, { useState } from 'react'
import MainImages from './mainImages'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Image from 'next/image';

export default function ProductQuickView({
    initialData
}) {

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
    return (
        <div className='relative'>
            <Carousel className="bg-white mb-5 w-full">
                <CarouselContent >
                    {imageGallery.map((img, index) => (
                        <CarouselItem className="" key={index.toString()}>
                            <div className='w-full h-auto overflow-hidden relative'>
                                <Image
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
            </Carousel>
        </div>
    )
}
