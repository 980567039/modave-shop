import moment from 'moment'
import Image from 'next/image'
import React from 'react'

export default function RecentCustomers() {
    return (
        <div className='flex flex-col gap-1 w-full'>
            <div className='flex gap-1 p-3 justify-between w-full items-center'>
                <div className='flex gap-2 items-center flex-3'>
                    <div className='w-[40px] h-[40px] overflow-hidden rounded-full bg-slate-100 flex items-center justify-center'>
                        CP
                    </div>
                    <div>
                        <p className='text-sm leading-3'>Chathuranga Pradeep</p>
                        <span className='text-xs text-muted-foreground'>ID: sdfdfwer345</span>
                    </div>
                </div>
                <div className='flex-1 text-right flex-col flex'>
                    <b className='text-xs'>Rs: 580</b>
                    <span className='block text-xs'>{moment("2024-06-26T10:55", "YYYY-MM-DDTHH:mm").fromNow()}</span>
                </div>
            </div>
        </div>
    )
}
