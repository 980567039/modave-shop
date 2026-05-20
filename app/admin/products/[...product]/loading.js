import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function loading() {
  return (
    <div className='flex gap-5 flex-col'>
      <div className='flex gap-3'>
        <Skeleton className="w-3/12"/>
        <Skeleton className="w-3/12"/>
        <Skeleton className="w-3/12"/>
      </div>
    </div>
  )
}
