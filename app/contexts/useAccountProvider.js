"use client";

import { createContext } from "react";

// Create the context
const UserAccountContext = createContext();

const UserAccountProvider = ({ children }) => {
    <UserAccountContext.Provider value={{}}>
        {children}  
    </UserAccountContext.Provider>
}

export { UserAccountContext, UserAccountProvider };
