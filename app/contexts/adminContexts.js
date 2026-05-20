"use client";
import { apiReq, isSameObjects, transformS3UrlsInObject, useDebouncedSave } from '@/lib/common';
import { createContext, use, useEffect, useRef, useState } from 'react';
import { useAuthContext } from './authUserProvider';
import { ref, child, onChildAdded, onChildChanged, onChildRemoved, off } from 'firebase/database';
import { database } from '@/lib/firebase';
import { toast } from 'sonner';
import SoundController from '../components/soundController';

// Create the context
const AdminContext = createContext();

const DEBOUNCE_DELAY = 2000;

const storeInitials = {

}

// Create a provider component
const AdminProvider = ({ children }) => {
    const [store, setStore] = useState(storeInitials);
    const [categories, setCategories] = useState([]);
    const [material, setMaterial] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [allNotifications, setAllNotifications] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    

    const getAllCoreData = async () => {
        try {
            setIsLoading(true);
            const res = await apiReq(`admin/core-data`, 'GET');

            if (res && res.status === 200) {
                const { data } = await res.json();

                setCategories(data?.categories);
                setMaterial(data?.materials);
                setAttributes(data?.attributes);

                setIsLoading(false);

                if (data?.store && Object.keys(data?.store).length !== 0) {
                    
                    setStore({
                        ...data?.store[0],
                        theme: data?.store?.theme ? data?.store.theme[0] : {},
                        orderCount: data?.orderCount,
                        loginUserData: data?.store?.userData || {}
                    });
                }

            } else {
                setOriginalCategories([]);
                setCategories([]);
                setStore({});
                setIsLoading(false);
            }

            
        } catch (error) {
            console.log(error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }


    useEffect(() => {
        getAllCoreData();

    }, []);

    return (
        <AdminContext.Provider value={{
            categories,
            setCategories,
            isLoading,
            material,
            setMaterial,
            attributes,
            setAttributes,
            store,
            setStore,
            getAllCoreData
        }}>
            
            {children}
            
            <SoundController
                play={isPlaying}
                soundUrl="/sounds/new-notification.mp3"
                onEnd={() => setIsPlaying(false)}
                volume={0.8}
            />
        </AdminContext.Provider>
    );
};

export { AdminContext, AdminProvider };
