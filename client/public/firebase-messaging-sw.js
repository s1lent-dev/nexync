importScripts("https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js"
);

let messaging;

// Fetch the Firebase config dynamically from the API
async function initializeFirebase() {
  try {
    const response = await fetch("/api/firebase-config");
    const firebaseConfig = await response.json();

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("[firebase-messaging-sw.js] Firebase initialized");

    messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log(
        "[firebase-messaging-sw.js] Received background message",
        payload
      );

      const link = payload.fcmOptions?.link || payload.data?.link;

      const notificationTitle = payload.notification.title;
      const notificationOptions = {
        body: payload.notification.body,
        icon: "./next.svg",
        data: { url: link },
      };

      self.registration.showNotification(
        notificationTitle,
        notificationOptions
      );
    });
  } catch (error) {
    console.error("[firebase-messaging-sw.js] Failed to fetch Firebase config:", error);
  }
}

self.addEventListener("install", (event) => {
  console.log("[firebase-messaging-sw.js] Installing...");
  event.waitUntil(initializeFirebase());
});

self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data.url;

      if (!url) return;

      for (const client of clientList) {
        if (client.url === url && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        console.log("OPENWINDOW ON CLIENT");
        return clients.openWindow(url);
      }
    })
  );
});
