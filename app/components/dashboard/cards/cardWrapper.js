import React from 'react'

export default function CardWrapper({title, children, tagline}) {
  return (
    <div className='rounded-3xl border-[1px] h-full'>
        <div className='px-3 py-4'>
            <h5 className='text-muted-foreground uppercase font-semibold text-[14px]'>{title}</h5>
            <p className='text-xs text-muted-foreground'>{tagline}</p>
        </div>
        {children}
    </div>
  )
}
