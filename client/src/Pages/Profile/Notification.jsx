import React from 'react';

function NotificationComponent() {
  const handleSend = () => {
    console.log("Button clicked");

    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission === "granted") {
      // If permission already granted, send notification directly
      sendNotification();
    } else if (Notification.permission === "denied") {
      alert("You have blocked notifications for this site. Please enable them in your browser settings.");
    } else {
      // Request permission
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
        if (permission === "granted") {
          sendNotification();
        } else {
          alert("Notification permission denied.");
        }
      });
    }
  };

  const sendNotification = () => {
    const notification = new Notification("Hi there!", {
      body: "This is a test notification.",
    //   icon: "https://via.placeholder.com/128", // optional icon URL
    });

    notification.onclick = function (event) {
      event.preventDefault(); // prevent default behavior
      window.focus();
      notification.close();
    };
  };

  return (
    <div>
      <button onClick={handleSend}>Send Notification</button>
    </div>
  );
}

export default NotificationComponent;
