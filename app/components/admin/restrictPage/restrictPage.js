import { AdminContext } from '@/app/contexts/adminContexts';
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import React, { useContext } from 'react'

export default function RestrictPage() {
  const session = useSession();
  const { isLoading } = useContext(AdminContext);


  return (
    <div className='px-10 py-[20vh] flex flex-col items-center justify-center'>
      {isLoading ? <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </> : <>
        <img src='/images/authentication.svg' width={200} height={200} alt='403' />
        <h1 className='text-4xl font-bold'>访问受限页面</h1>
        <h3>您没有权限查看此页面</h3>
      </>}
    </div>
  )
}
