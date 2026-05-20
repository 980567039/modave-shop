"use client";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthUserProvider({ children }) {
    const session = useSession();
    const [user, setUser] = useState({});
    const [isLoadingUserData, setIsLoadingUserData] = useState(true);
    const router = useRouter();

    const getCurrentUserMeta = async (uData) => {
        
        try {
            
            if(uData && uData?.id){
                const res = await fetch('/api/user-meta', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }, 
                    body: JSON.stringify({
                        userId: uData.id,
                    })
                });

                
        
                if(res && res.status === 200){
                    const data = await res.json();

                    
                    
                    // delete data.business.__v; // remove the 'v' field
                    // delete data.userMetaData._id; // remove the 'id' field
                    // delete data.userMetaData.__v; // remove the 'v' field
                    // delete data.user; // remove the 'user' field
                    
                    const payload = {
                        ...session,
                        ...uData,
                        userMeta: data.userMetaData,
                        business: {
                            ...data.business,
                            id: data.business._id
                        }
                    }
        
                    delete payload.business._id; // remove the 'id' field
        
                    setUser(payload);
                    setIsLoadingUserData(false)
                }
            }
        } catch (e) {
            // TODO: if the authentication is SSO, user has to register in the database
            // This is probably not the best solution
            setUser({...session, ...uData });
        }
    };

    useEffect(() => {
       
        
        if (session?.status === "authenticated" && session?.data?.user?.id) {
            getCurrentUserMeta(session.data.user);
            // router.push('/dashboard');
        }
    }, [session]);
    
    return (
        <AuthContext.Provider value={{ user, setUser, isLoadingUserData }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    return useContext(AuthContext);
}
