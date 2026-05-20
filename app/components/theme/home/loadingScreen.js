import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

export default function HomeLoadingScreen() {
  return (
    <div>
        <Skeleton className="h-[60vh] md:h-[80vh]"/>
        <Skeleton className="h-[130px] w-full border-t-[1px]"/>
    </div>
  )
}
