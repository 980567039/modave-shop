import Link from 'next/link'
import React from 'react'

export default function NeedHelp({
  data
}) {
  
  return (
    <div className='text-xs px-5 space-y-3'>
        <label className='block font-semibold underline'>Need Help?</label>

        <div className='space-y-1 text-muted-foreground'>
            <p>Contact: <Link className='font-semibold' href={`tel:${data?.footer?.leftContent?.phone.replace(' ', '')}`}>{data?.footer?.leftContent?.phone}</Link></p>
            <p>Email: <Link className='font-semibold' href={`mailto:${data?.footer?.leftContent?.email}`}>{data?.footer?.leftContent?.email}</Link></p>
        </div>
    </div>
  )
}
