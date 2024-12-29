import admin from 'firebase-admin';
import { Message, getMessaging } from "firebase-admin/messaging";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FRONTEND_URL } from '../config/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../certs/service_key.json"), 'utf8'));

class NotifyService {

    private messaging: admin.messaging.Messaging;
    constructor() {
        this.messaging = this.initFirebase();
    }

    // Initialize Firebase Admin SDK
    private initFirebase(): admin.messaging.Messaging {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            });
        }
        return admin.messaging();
    }

    // Method to send notifications
    async sendNotification({
        title,
        body,
        token,
    }: {
        title: string;
        body: string;
        token: string;
    }) {
        try {
            console.log("Preparing to send notification:", { title, body, token });

            const payload: Message = {
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
        } catch (error) {
            console.error("Error sending notification:", error);
            return { success: false, error };
        }
    }
}

export default new NotifyService();
