import React from 'react';

function NotificationComponent() {
    const handleSend = () => {
        console.log("clicked");

        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
            return;
        }

        Notification.requestPermission().then(function (permission) {
            console.log(Notification.permission);
            if (permission === "granted") {
                const notification = new Notification("Hi there!");
                notification.onclick = function (event) {
                    event.preventDefault(); // prevent the browser from focusing the Notification's tab
                    window.focus(); // focus the current window
                    notification.close(); // close the notification
                };
            }
        });
    };

    return (
        <div>
            <button onClick={handleSend}>Send Notification</button>
        </div>
    );
}

export default NotificationComponent;
