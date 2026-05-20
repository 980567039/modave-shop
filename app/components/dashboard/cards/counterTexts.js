import NumberTicker from '@/components/magicui/number-ticker'
import { ArrowDown, ArrowUp } from 'lucide-react'
import React from 'react'

export default function CounterTexts({
    icon,
    count,
    status,
    parentage,
    tagline,
    taglinePosition,
    isPrice,
    hideParsonage
}) {
    return (
        <div className='flex flex-col gap-2 px-3'>
            <div className='flex gap-2 items-center'>
                {icon && <div className='w-[40px] h-[40px] flex items-center justify-center border-[1px] rounded-full'>{icon}</div>}
                <div className='block flex-1'>
                    <div className='flex items-center justify-between'>
                        
                        <h4 className='text-xl font-bold leading-5'><NumberTicker value={count} currency={isPrice ? 'LKR' : null} /></h4>

                        {!hideParsonage && <div className={`flex items-center gap-1 ${status === "up" ? "text-green-600" : "text-red-600"}`}>
                            <div className={`w-5 h-5 rounded-full ${status === "up" ? "bg-green-200" : "bg-red-200"} flex items-center justify-center`}>
                                {status === "up" ? <ArrowUp className='w-3 h-3 ' /> : <ArrowDown className='w-3 h-3 ' />}
                            </div>
                            <p className='font-bold text-sm '>{status === "up" ? "+" : "-"}{parseFloat(parentage)}%</p>
                        </div>}
                    </div>
                    {taglinePosition !== "right" && <p className='text-sm text-muted-foreground'>{tagline}</p>}
                </div>
            </div>
        </div>
    )
}
