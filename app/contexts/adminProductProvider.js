"use client";
import { apiReq, isSameObjects, useDebouncedSave } from '@/lib/common';
import { createContext, useEffect, useRef, useState } from 'react';
import { useAuthContext } from './authUserProvider';

// Create the context
const AdminProductContext = createContext();

const DEBOUNCE_DELAY = 2000;

// Create a provider component
const AdminProductProvider = ({ children }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);


    return (
        <AdminProductContext.Provider value={{
            selectedCategories, 
            setSelectedCategories
        }}>
            {children}
        </AdminProductContext.Provider>
    );
};

export { AdminProductContext, AdminProductProvider };
