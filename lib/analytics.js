'use client'

import Analytics from 'analytics'
import databasePlugin from './plugins/databasePlugin';
import { database } from './firebase';
import { ref, child, push, get, set, onValue } from 'firebase/database';
import { trackVisitor } from '@/app/hooks/useVisitorTracking';

const saveToDatabase = async (d) => {
    const userId = localStorage.getItem('uniqueID');
    return false;
    
    console.error('d?.data?.properties===' , d?.data?.properties);
    if (!userId || !d?.data?.properties) {
        console.error('Missing userId or data properties');
        return false;
    }
    
    const { path, referrer, title } = d.data.properties;
    // console.log("path, referrer, title ===", path, referrer, title);
    // return false;

    const timestamp = new Date().toISOString();
    // return false;

    try {
        let userRef = ref(database, `analytics/`);

        // Check if userRef is valid
        if (!userRef) {
            console.warn('userRef is undefined, creating a new one');
            userRef = ref(database, `analytics/`);
        }

        const snapshot = await get(userRef);
        const userData = snapshot.val() || {};
        const pageVisits = userData.pageVisits || [];
        const realTimePageVisits = userData.realTimePageVisits || [];

        pageVisits.push({
            path,
            referrer: referrer || '',
            title: title || '',
            timestamp,
            userId,
            timeSpent: 0 // Will be updated when leaving the page
        });

        await set(userRef, {
            ...userData,
            pageVisits,
            // userId,
            lastActive: timestamp
        });

        console.log('Data successfully saved to database');
    } catch (error) {
        console.error('Error saving data to database:', error);
    }
};

const analytics = Analytics({
    app: 'ecom-app',
    plugins: [
        databasePlugin({
            saveToDatabase: saveToDatabase
        })
    ]
});

export default analytics;