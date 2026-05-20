"use client"
import { useSession } from 'next-auth/react';
// authMiddleware.js
import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

export const withAuth = (WrappedComponent) => {
    const AuthComponent = (props) => {
        const session = useSession();
        const router = useRouter();

        useEffect(() => {
            // Check authentication status
            const isAuthenticated = session?.status === "authenticated"; // Replace checkAuth with your authentication logic

            if (!isAuthenticated) {
                // If not authenticated, redirect to login page
                router.push('/auth/login');
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };

    return AuthComponent;
};
