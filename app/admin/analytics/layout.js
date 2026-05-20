"use client"
import RestrictPage from '@/app/components/admin/restrictPage/restrictPage';
import { AdminContext } from '@/app/contexts/adminContexts';
import { useSession } from 'next-auth/react';
import React, { useContext } from 'react'

export default function AnalyticsLayout({
    children
}) {

  const { store } = useContext(AdminContext);

  if(!store?.loginUserData?.capabilities?.includes('analytics')){
    return <RestrictPage />;
  } else{
    return (
      <div>
        {children}
      </div>
    )
  }
}
