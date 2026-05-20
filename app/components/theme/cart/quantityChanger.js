"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function QuantityChanger({
    initValue = 1,
    maxCount,
    onPlus,
    onMinus,
    onQuantityChange,
    popupCartRow
}) {
    const [count, setCount] = useState(1);
    const [maximumCount, setMaximumCount] = useState( '');

    const handleChangeInput = (e) => {
        const cleanedStr = e.target.value.replace(/[^0-9]/g, '');
        const newCount = parseInt(cleanedStr, 10);
        if (!isNaN(newCount) && newCount >= 1) {
            setCount(newCount);
        }
    }

    const handleIncrement = () => {
        if (count < maximumCount) {
            const newCount = count + 1;
            setCount(newCount);
            onQuantityChange(newCount)
            if (onPlus) {
                onPlus(newCount)
            };
        }else{
            alert(`Currently, only ${maximumCount} ${maximumCount > 1 ? 'items are' : 'item is'} left in stock.`)
        }
    }

    const handleDecrement = () => {
        if (count > 1) {
            const newCount = count - 1;
            setCount(newCount);
            onQuantityChange(newCount)
            if (onMinus) {
                onMinus(newCount)
            };
        }
    }

    useEffect(() => {
        setCount(initValue);

        if (maxCount) {
            setMaximumCount(maxCount);
        }
    }, [maxCount]);


    useEffect(() => {
        if (initValue) {
            setCount(initValue);
        }
    }, [initValue]);

    return (
        <div className='flex items-center gap-1'>
            <Button 
                variant="ghost" 
                className="w-10 h-10 p-0 flex items-center justify-center rounded-full border-[1px] bg-white hover:border-white/60 hover:text-white transition-all ease-in-out delay-75" 
                onClick={handleDecrement}
            >
                <Minus className='w-3 h-3 text-black' strokeWidth={1.5}/>
            </Button>
            <Input 
                value={count} 
                placeholder="1" 
                className={`w-12 text-center rounded-2xl ${popupCartRow ? 'text-white' : 'text-black'} text-[10px] bg-transparent backdrop-blur-xl border-0 h-[35px]`} 
                size="sm" 
                onChange={handleChangeInput}
                readonly
            />
            <Button 
                variant="ghost" 
                className={`w-10 h-10 p-0 flex items-center justify-center rounded-full bg-black ${popupCartRow ? 'border-[1px] border-white/35' : ''} hover:border-white/60 hover:bg-black hover:text-white transition-all ease-in-out delay-75`} 
                onClick={handleIncrement}
            >
                <Plus className='w-3 h-3' strokeWidth={1.5}/>
            </Button>
        </div>
    )
}
