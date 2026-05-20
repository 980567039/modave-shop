"use client";
import RestrictPage from '@/app/components/admin/restrictPage/restrictPage';
import { AdminContext } from '@/app/contexts/adminContexts';
import { AdminProductProvider } from '@/app/contexts/adminProductProvider';
import { useAuthContext } from '@/app/contexts/authUserProvider';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react'

export default function AdminProductLayout({ children }) {
  const session = useSession();
  const route = useRouter();
  const user = useAuthContext();
  const { store } = useContext(AdminContext);

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      route.push('/auth/login');
    }
  }, [session, route]);

  if (session?.status === "loading") {
    return <p>Loading</p>;
  }

  if (!store?.loginUserData?.capabilities?.includes('products')) {
    return <RestrictPage />;
  } else{
    return (
      <AdminProductProvider>
        {children}
      </AdminProductProvider>
    )
  }
}
