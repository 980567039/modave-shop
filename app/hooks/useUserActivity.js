"use client";

import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue, increment, set, onDisconnect } from 'firebase/database';

function useActiveUsersCount(inactiveTime = 60000) {
    const [isActive, setIsActive] = useState(true);
    const [activeUsersCount, setActiveUsersCount] = useState(0);

    useEffect(() => {
        const db = getDatabase();
        const activeUsersRef = ref(db, 'activeUsers');
        let timeout;

        const updateActiveUsers = (change) => {
            set(activeUsersRef, increment(change));
        };

        const resetTimeout = () => {
            clearTimeout(timeout);
            if (!isActive) {
                setIsActive(true);
                updateActiveUsers(1);
            }
            timeout = setTimeout(() => {
                setIsActive(false);
                updateActiveUsers(-1);
            }, inactiveTime);
        };

        const handleBeforeUnload = () => {
            updateActiveUsers(-1);
        };

        const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
        events.forEach(event => window.addEventListener(event, resetTimeout));
        window.addEventListener('beforeunload', handleBeforeUnload);

        // Initialize user as active
        updateActiveUsers(1);
        resetTimeout();

        // Set up onDisconnect handler
        onDisconnect(activeUsersRef).set(increment(-1));

        // Listen for changes in active users count
        const unsubscribe = onValue(activeUsersRef, (snapshot) => {
            setActiveUsersCount(snapshot.val() || 0);
        });

        return () => {
            events.forEach(event => window.removeEventListener(event, resetTimeout));
            window.removeEventListener('beforeunload', handleBeforeUnload);
            clearTimeout(timeout);
            updateActiveUsers(-1);
            unsubscribe();
        };
    }, [inactiveTime, isActive]);

    return { isActive, activeUsersCount };
}

export default useActiveUsersCount;