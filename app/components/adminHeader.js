import { Breadcrumb} from '@/components/ui/breadcrumb'
import React from 'react'

export default function AdminHeader({title, descriptions, children, buttons}) {
    return (
        <div className='flex gap-4 flex-col'>
            <Breadcrumb>
                {children}
            </Breadcrumb>

            <div className='flex gap-2 justify-between items-center'>
                <div className='flex gap-2 flex-col'>
                    <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">{title}</h2>
                    <p className='text-muted-foreground text-xs'>{descriptions}</p>
                </div>
                <div>
                    {buttons}
                </div>
            </div>
        </div>
    )
}
