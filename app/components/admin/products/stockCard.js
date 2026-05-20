import NumberTicker from '@/components/magicui/number-ticker'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import React from 'react'

export default function StockCard({
    title,
    tagline,
    number,
    textColor,
    custom
}) {
    return (
        <Card className={'rounded-2xl'}>
            <CardHeader>
                <CardTitle className={`${textColor || ''}`}>{title}</CardTitle>
                {tagline && <CardDescription>{tagline}</CardDescription>}
            </CardHeader>
            <CardContent className="grid gap-4">
                {number && <p className={`whitespace-pre-wrap text-4xl font-extrabold `}>
                    {number ? <NumberTicker value={number} className={`${textColor || ''}`}/> : <div className='font-semibold text-4xl'>0</div>}
                </p>}

                {custom}
            </CardContent>
        </Card>
    )
}
