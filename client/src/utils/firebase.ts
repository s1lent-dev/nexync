import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

// Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCnL_f0nmkdSlrz7djsW1MCEqdsSXRdXQQ",
    authDomain: "nexync-zenith.firebaseapp.com",
    projectId: "nexync-zenith",
    storageBucket: "nexync-zenith.firebasestorage.app",
    messagingSenderId: "72936729458",
    appId: "1:72936729458:web:0b75126e954f8b84e14beb",
    measurementId: "G-00LSZ722JM"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const messaging = async () => {
    const supported = await isSupported();
    return supported ? getMessaging(app) : null;
};

export const fetchToken = async () => {
    try {
        const fcmMessaging = await messaging();
        if (fcmMessaging) {
            const token = await getToken(fcmMessaging, {
                vapidKey: 'BAjRfWSJzNdxB9rT3SVqzK1UxmNCa6VY06I6rlnQwfMezaLXGQ3PNkA_dxVWH9PQ5WiRrGaRUTqkRNTYs__23FI',
            });
            console.log('Token:', token);
            return token;
        }
        return null;
    } catch (err) {
        console.error("An error occurred while fetching the token:", err);
        return null;
    }
};

export { app, messaging };
