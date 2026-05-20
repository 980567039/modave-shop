'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useMotionValue, useSpring, useTransform, useAnimationControls } from 'framer-motion';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import CategoryCardItem from './categoryCardItem';
import ProductCard from '../cards/productCard';

export default function TrendingSection({
    data
}) {
    const [api, setApi] = useState()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    const [isPaused, setIsPaused] = useState(false)

    // Create motion values for mouse position
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Add spring physics for smoother movement
    const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

    // Reference to the container element
    const containerRef = useRef(null);

    // Controls for the infinite text animation
    const controls = useAnimationControls();

    // Initialize the animation
    useEffect(() => {
        controls.start({
            x: ["0%", "-100%"],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                }
            }
        });
    }, [controls]);

    // Transform mouse position for vertical text movement and image movement
    const textY = useTransform(springY, [-500, 500], [20, -20]);

    // Image movement (creates parallax)
    const imageX = useTransform(springX, [-500, 500], [-10, 10]);
    const imageY = useTransform(springY, [-500, 500], [-8, 8]);

    // Track mouse position relative to the container
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                // Get mouse position relative to the center of the container
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                // Calculate mouse position relative to the center
                mouseX.set(e.clientX - rect.left - centerX);
                mouseY.set(e.clientY - rect.top - centerY);
            }
        };

        window.addEventListener("mousemove", handleMouseMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [mouseX, mouseY]);

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    // Autoplay functionality
    useEffect(() => {
        if (!api) return

        // Interval for autoplay - change 3000 to adjust speed (in milliseconds)
        const autoplayInterval = setInterval(() => {
            api.scrollNext()
        }, 3000)

        // Clean up interval on component unmount
        return () => clearInterval(autoplayInterval)
    }, [api])



    return (
        <div className="px-3">

            <div className="border-[1px] border-black/5 rounded-3xl md:grid md:grid-cols-2 flex flex-col-reverse flex-grow items-start md:items-stretch overflow-hidden">
                <div className="relative flex items-end justify-center group overflow-hidden w-full" ref={containerRef}>
                    {/* Wrapper for the infinite scrolling text */}
                    <div className="absolute left-0 top-[40%] w-full h-full overflow-hidden z-0">
                        <div className="flex whitespace-nowrap">
                            {/* First copy of text */}
                            <motion.div
                                animate={controls}
                                className="inline-flex whitespace-nowrap font-headingFontMedium font-semibold text-[100px] leading-[100px] md:text-[300px] uppercase md:leading-[300px] tracking-[20px] text-black transition-all ease-in-out duration-700 group-hover:blur-sm"
                                style={{
                                    y: textY,
                                }}
                            >
                                Trending&nbsp;Trending&nbsp;Trending&nbsp;
                            </motion.div>

                            {/* Second copy to ensure seamless loop */}
                            <motion.div
                                animate={controls}
                                className="inline-flex whitespace-nowrap font-headingFontMedium font-semibold text-[100px] leading-[100px] md:text-[300px] uppercase md:leading-[300px] tracking-[20px] text-black transition-all ease-in-out duration-700 group-hover:blur-sm"
                                style={{
                                    y: textY,
                                }}
                            >
                                Trending&nbsp;Trending&nbsp;Trending&nbsp;
                            </motion.div>
                        </div>
                    </div>

                    <motion.div
                        style={{
                            x: imageX,
                            y: imageY,
                        }}
                        className="z-10 relative w-[75%]"
                    >
                        <Image
                            src={data?.leftImage || '/images/trending.png?id=5'}
                            alt="Trending uptown"
                            width={800}
                            height={600}
                            className="w-full mx-auto"
                            unoptimized={true}
                        />
                    </motion.div>
                </div>
                <div className="bg-black text-white flex items-center justify-center p-4 md:p-0 w-full md:py-10 rounded-3xl md:rounded-none">
                    <div className='flex flex-col gap-10 items-center'>
                        <h4 className='font-headingFontMedium uppercase text-2xl tracking-[4px] pt-5 md:pt-0'>{data?.sectionTitle}</h4>
                        <div className='max-w-[80vw] md:w-[300px] mx-auto'>
                            {data?.selectedProducts && data?.selectedProducts?.length > 0 && <Carousel
                                opts={{
                                    align: "start",
                                    loop: true,
                                }}
                                setApi={setApi}
                                >
                                <CarouselContent>
                                    {data?.selectedProducts?.map((d, i) => (
                                        <CarouselItem key={`trending-product-${i}`} className="h-[670px] md:h-auto w-full">
                                            <ProductCard data={d} />
                                        </CarouselItem>
                                    ))}

                                </CarouselContent>

                                <CarouselPrevious className="bg-transparent border-0 hidden md:flex" />
                                <CarouselNext className="bg-transparent border-0 hidden md:flex" />
                            </Carousel>}
                        </div>

                        <Link href="/shop/categories" className='flex items-center gap-3 uppercase tracking-[2.5px] text-xs group transition-all ease-in-out duration-100 hover:underline underline-offset-8'>Explore all <Plus size={15} className='transition-all ease-in-out duration-100 group-hover:rotate-180' /> </Link>
                    </div>


                    {/* Content for the right side */}
                </div>
            </div>
        </div>
    );
}