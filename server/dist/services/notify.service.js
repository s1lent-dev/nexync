import admin from 'firebase-admin';
import { FRONTEND_URL, FIREBASE_SERVICE_ACCOUNT } from '../config/config.js';
class NotifyService {
    constructor() {
        this.messaging = this.initFirebase();
    }
    // Initialize Firebase Admin SDK
    initFirebase() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT),
            });
        }
        return admin.messaging();
    }
    // Method to send notifications
    async sendNotification({ title, body, token, }) {
        try {
            console.log("Preparing to send notification:", { title, body, token });
            const payload = {
                token: token,
                notification: {
                    title,
                    body,
                },
                webpush: FRONTEND_URL
                    ? {
                        fcmOptions: {
                            link: FRONTEND_URL,
                        },
                    }
                    : undefined,
            };
            const response = await admin.messaging().send(payload);
            console.log("Notification sent successfully:", response);
            return { success: true, message: "Notification sent", response };
        }
        catch (error) {
            console.error("Error sending notification:", error);
            return { success: false, error };
        }
    }
}
export default new NotifyService();
