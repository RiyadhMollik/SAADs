import { RouterProvider } from "react-router-dom";
import { router } from "./Routes/Routes";
import { requestNotificationPermission, onMessageListener } from "./firebase";
import { useEffect } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
function App() {
  useEffect(() => {
    const setupFCM = async () => {
      const token = await requestNotificationPermission();
      if (token) {
        console.log("✅ FCM Token:", token);

        // Use your onMessageListener Promise to listen for foreground messages
        onMessageListener()
          .then((payload) => {
            console.log("📩 Message received:", JSON.stringify(payload, null, 2));

            // Extract notification data (adjust based on payload structure)
            const { title, body } = payload.notification || payload.data || {};
            if (!title || !body) {
              console.warn("No title/body in notification payload:", payload);
              return;
            }

            // Log permission status for debugging
            console.log("Notification permission:", Notification.permission);

            // Check if Notification API is supported and permission is granted
            if ("Notification" in window) {
              if (Notification.permission === "granted") {
                new Notification(title, {
                  body: body,
                  icon: "/path/to/icon.png", // Optional: replace with your icon path
                });
              } else if (Notification.permission !== "denied") {
                // Request permission if not yet granted or denied
                Notification.requestPermission().then((permission) => {
                  console.log("Permission result:", permission);
                  if (permission === "granted") {
                    new Notification(title, {
                      body: body,
                      icon: "/path/to/icon.png", // Optional: replace with your icon path
                    });
                  }
                });
              } else {
                console.warn("Notification permission denied.");
              }
            } else {
              console.error("Notification API not supported in this browser.");
            }
          })
          .catch((err) => {
            console.error("Failed to receive foreground message:", err);
          });

      }
    };

    setupFCM();
  }, []);

  return <RouterProvider router={router} />;
}

export default App;
