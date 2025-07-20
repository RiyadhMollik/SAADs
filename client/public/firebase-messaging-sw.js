// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCI8tVKGCaa4CLRL2lVOgpMPhhLtiViZyY",
    authDomain: "saads-7f981.firebaseapp.com",
    projectId: "saads-7f981",
    storageBucket: "saads-7f981.firebasestorage.app",
    messagingSenderId: "436012093770",
    appId: "1:436012093770:web:a1f5f38ebae2e9bb59f1b3",
    measurementId: "G-VNPMET33D6"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("📥 Background message:", payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: "logo.png", // Optional icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
