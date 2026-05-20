import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function DashboardCardLoading() {
    return (
        <>
            <div className='flex gap-2 px-3'>
                <div className='flex gap-2 items-center'>
                    <Skeleton className="w-[40px] h-[40px] rounded-full" />
                </div>
                <div className='block flex-1'>
                    <div className='flex items-center justify-between'>

                        <Skeleton className="w-[120px] h-5 mb-3" />

                        <div className={`flex items-center gap-1`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center`}>
                                <Skeleton className="w-[10px] h-[10px]" />
                            </div>
                            <Skeleton className="w-[20px] h-3" />

                        </div>
                    </div>
                    <Skeleton className="w-[100px] h-2" />
                </div>
            </div>
            <Skeleton className="w-full h-[270px] mt-3 mb-3" />
            <Skeleton className="w-full h-[54px] mt-3" />
        </>
    )
}
