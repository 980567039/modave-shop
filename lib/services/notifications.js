import { ref, push, serverTimestamp } from 'firebase/database';
import { database } from '../firebase';


export const sendNotification = async ({ title, body, icon, data }) => {
    if (!database) {
        return false;
    }

    try {
        const notificationsRef = ref(database, 'notifications');
        await push(notificationsRef, {
            title,
            body,
            icon,
            data,
            timestamp: serverTimestamp(),
            id: Date.now().toString(),
        });
        return true;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
};
