

import Image from 'next/image'
import React from 'react'
import { motion } from 'framer-motion'
import TypingAnimation from '../../theme/text/typingAnimation'
import BlurIn from '../../theme/text/blurInText';

export default function RenderWelcomeCard() {
    const welcomeMessage = `
    很高兴您回来。探索功能，管理您的数据，充分利用您的体验。
    如果您需要任何帮助，请随时联系我们的支持团队。
    
    祝您工作愉快！
  `;

    // Animation variants for cards
    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // This creates the one-by-one effect
                delayChildren: 0.3    // Delay before starting animations
            }
        }
    };

    const cardVariants = {
        hidden: {
            scale: 0.8,
            opacity: 0
        },
        show: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        }
    };

    const cardData = [
        {
            title: '总销售额',
            description: '总销售数量',
            value: '256'
        },
        {
            title: '总收入',
            description: '总销售数量',
            value: 'LRK 25,600'
        },
        {
            title: '今日订单',
            description: '总销售数量',
            value: '02'
        },
        {
            title: '今日订单价值',
            description: '总销售数量',
            value: 'LRK 15,100'
        }
    ];

    return (
        <div className='p-10 overflow-hidden rounded-2xl relative'>
            <img src="/images/welcome-back.jpg?v=1" alt="欢迎回来" width={700} height={300} className='absolute left-0 top-0 w-full h-full object-cover z-0' />
            <div className='absolute left-0 top-0 bg-black/45 w-full h-full'></div>

            <div className='relative z-10 text-white space-y-5'>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className='font-semibold text-2xl'>欢迎</h1>
                    <TypingAnimation text={welcomeMessage} className="text-sm" duration={10} />
                </motion.div>

                <motion.div
                    className='grid grid-cols-4 gap-4'
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                >
                    {cardData.map((card, index) => (
                        <motion.div
                            key={index}
                            className='rounded-2xl bg-black/45 p-5 space-y-3 backdrop-blur-sm'
                            variants={cardVariants}
                        >
                            <div>
                                <h3 className='font-bold font-headingFontMedium tracking-wide'>{card.title}</h3>
                                <p className='text-xs'>{card.description}</p>
                            </div>
                            <div className='text-4xl font-extrabold'>
                                {card.value}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    )
}