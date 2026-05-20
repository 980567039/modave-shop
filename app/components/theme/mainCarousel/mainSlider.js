"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { useEffect, useState } from 'react'
import Autoplay from "embla-carousel-autoplay"
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Picture from './picture';
import Link from 'next/link';
import FeaturedProductCard from './featuredProductCard';

// Animation variants for the content
const contentVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
    },
};

// Container variant for staggered children
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        },
    },
};

export default function MainSlider({ data, fullData }) {
    const [api, setApi] = useState(null);
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [shuffledProducts, setShuffledProducts] = useState([]);
    const router = useRouter();


    const renderDots = () => {
        const dots = [];
        for (let index = 0; index < count; index++) {
            dots.push(
                <div
                    key={index}
                    className={`w-[10px] h-[10px] rounded-full border-[2px] ${current - 1 === index ? "bg-slate-600" : "bg-white"} block`}
                />
            );
        }
        return dots;
    }

    // Fisher-Yates shuffle algorithm
    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Shuffle products when component mounts or when products change
    useEffect(() => {
        if (fullData?.selectedProducts && fullData?.selectedProducts.length > 0) {
            const shuffled = shuffleArray(fullData?.selectedProducts);
            setShuffledProducts(shuffled);
        }
    }, [fullData]);

    useEffect(() => {
        if (!api) return;

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    useEffect(() => {
        
        if (data && data.length > 0) {
            setIsLoading(false);
        }
    }, [data]);

    return (
        <div className='relative p-3 pb-0'>
            <div className='overflow-hidden rounded-tl-3xl rounded-tr-3xl h-[calc(100vh-10px)] relative z-10'>
                <div className='absolute top-0 left-0 w-full h-full bg-black/50 z-20 rounded-tl-3xl rounded-tr-3xl' />
                {/* <div className='absolute top-0 left-0 w-full h-full  rounded-tl-3xl rounded-tr-3xl overflow-hidden' >
                    <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        width="100%"
                        height="auto"
                        src={data[0]?.video || "/videos/0_Woman_Girl_1280x720.mp4"}
                        poster={data[0]?.image || "/images/uptown-sri-lanka.webp"}
                        className='absolute w-full h-full object-cover'
                    >
                        Your browser does not support the video tag.
                    </video>
                </div> */}

                {shuffledProducts && shuffledProducts?.length > 0 && shuffledProducts.slice(0, 1).map((d, i) => (<FeaturedProductCard key={`feature-card-${i}`} product={d} />))}

                {isLoading ? (
                    <div className="m-0 p-0 h-[92vh] md:h-[92vh] relative blur-3xl">
                        <Picture
                            mobileSrc={'/uploads/986b9330dbbed98cd6d1630918f5c008458eb3b1b8fe7ec09eeba7e358b3e331'}
                            desktopSrc={'/uploads/99b00fe75a7a20ced6cad577906a728dd6ac1759443982102c5b4a43aed5b8e2'}
                            alt={`slider_landing`}
                            mobileWidth={640}
                            mobileHeight={480}
                            desktopWidth={1920}
                            desktopHeight={1080}
                            className='w-full absolute md:relative left-0 top-0 h-full object-cover'
                        />
                    </div>
                ) : (
                    <Carousel
                        setApi={setApi}
                        className="z-0 m-0 p-0"
                        opts={{
                            loop: true,
                        }}
                        plugins={[
                            Autoplay({
                                delay: 5000,
                            }),
                        ]}
                    >
                        <CarouselContent className="m-0">
                            {data && data?.length > 0 && (
                                data?.map((slider, i) => (
                                    <CarouselItem key={i.toString()} className="m-0 p-0 h-[100vh] md:h-[100vh] relative">
                                        <Link href={slider?.link || "#"} className={`${slider?.link === "" && 'cursor-move'}`}>

                                            <Picture
                                                mobileSrc={slider?.mobileImage || slider?.image}
                                                desktopSrc={slider?.image || 'https://dummyimage.com/1900x800/ddd/000'}
                                                alt={`slider_${i}`}
                                                mobileWidth={640}
                                                mobileHeight={480}
                                                desktopWidth={1920}
                                                desktopHeight={1080}
                                                className='w-full absolute md:relative left-0 top-0 h-full object-cover'
                                            />

                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={current}
                                                    variants={containerVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="hidden"
                                                    className='
                                                        absolute 
                                                        bottom-10 
                                                        left-0
                                                        p-[20px] 
                                                        space-y-3 
                                                        w-full
                                                        md:left-[100px] 
                                                        md:bottom-auto 
                                                        md:top-[50%] 
                                                        md:translate-y-[-50%]
                                                        lg:w-[30vw]
                                                        xl:left-[6vw]
                                                    '
                                                >
                                                    {slider?.mainText && (
                                                        <motion.h3
                                                            variants={contentVariants}
                                                            className='text-4xl font-semibold xl:text-[50px] xl:leading-[50px]'
                                                            dangerouslySetInnerHTML={{ __html: slider?.mainText }}
                                                        />
                                                    )}

                                                    {slider?.tagline && (
                                                        <motion.p
                                                            variants={contentVariants}
                                                            className='max-w-[50%] lg:max-w-[60%] text-muted-foreground xl:max-w-full'
                                                            style={{ color: slider?.descriptionTextColor?.hex || '#000' }}
                                                            dangerouslySetInnerHTML={{ __html: slider?.tagline }}
                                                        />
                                                    )}

                                                    {slider?.link && slider?.buttonText !== "" && (
                                                        <motion.div variants={contentVariants}>
                                                            <Button
                                                                onClick={() => router.push(slider?.link)}
                                                                className="rounded-none hover:px-5 transition-all ease-in-out delay-75"
                                                            >
                                                                {slider?.buttonText || 'Explore more'}
                                                                <ArrowRight className='ml-2 w-4 h-4' />
                                                            </Button>
                                                        </motion.div>
                                                    )}
                                                </motion.div>
                                            </AnimatePresence>
                                        </Link>
                                    </CarouselItem>
                                ))
                            )}
                        </CarouselContent>

                        <CarouselPrevious className="absolute bottom-0 left-5 hidden md:flex" />
                        <CarouselNext className="absolute bottom-0 right-5 hidden md:flex" />
                    </Carousel>
                )} 

                <div className='flex bottom-5 z-20 absolute left-[50%] translate-x-[-50%] gap-1'>
                    {renderDots()}
                </div>
            </div>
        </div>
    )
}