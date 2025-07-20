// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyCI8tVKGCaa4CLRL2lVOgpMPhhLtiViZyY",
    authDomain: "saads-7f981.firebaseapp.com",
    projectId: "saads-7f981",
    storageBucket: "saads-7f981.firebasestorage.app",
    messagingSenderId: "436012093770",
    appId: "1:436012093770:web:a1f5f38ebae2e9bb59f1b3",
    measurementId: "G-VNPMET33D6"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
    try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
            console.log("✅ Notification permission granted.");
            const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");

            const token = await getToken(messaging, {
                vapidKey: "BDt2B8jDMfThDN9y7e1CzZabNLbMcBAzZrvZ1zJWc8aC_1BOvk_GMA-jc6brJL15gaKH7Sxk9DBfQihOE8zE86c", // replace with your actual VAPID key
                serviceWorkerRegistration: registration,
            });

            console.log("📱 FCM Token:", token);
            if (token) {
                console.log("📱 FCM Token:", token);
                return token;
            } else {
                console.warn("❌ No token received.");
            }
        } else {
            console.warn("❌ Notification permission denied.");
        }
    } catch (err) {
        console.error("❌ Error getting permission or token:", err);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
