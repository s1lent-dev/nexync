import admin from 'firebase-admin';
import { Message, getMessaging } from "firebase-admin/messaging";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { FRONTEND_URL } from '../config/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const serviceAccount = {
    "type": "service_account",
    "project_id": "nexync-zenith",
    "private_key_id": "4e4fe8a6c53712e8b6cb5fa57d14485ebeabd1b5",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDdk+1JmcC944iw\nkzHxAISZyzqqBQlGmvPGCSos9ad+5T7t479bxzLSdXgfWEoK9rX74m9am16ny+5K\nwRgFtkDfMCUsb3Ss1SFDBgZ/tyIbowquYwnl8LU8cYo6ayimIyLAnjRSiYJ4scjA\nqdHg4PYCa0iNpuxcV6dNvvfKU9E2TLXrnkiOdf95y5p7q0kDEuE4gSV3LE1h15EQ\nhQuc47PHu7GTtUxkD3+aJOMYA2R7hilCZehHrgJm9I4v/onRCHSZClj/LN/DJ/8s\nx5DQsfK9Gf7s8rFbg5Z5kCJOppEM4PH46ijx8a0YZ4y2ZXR98dpiJa3K6yCh2LN7\ns/D4EtSZAgMBAAECggEAL3F7ls1JlD8SZwB1ao16VvXJb1sZs9j8xlPzCGJnBUgv\ns78Wm5+o1aBaYpfEbtmJeM/wmN14pIQJV09GBf8Sn9dOtld9C36tGw1Aufrr3jAI\nWvOQzH/ARptnBgAo2X3fdI/LUzrnSVGD0yDpc/WnJzhydgYeSN1p0L9JjjRpMO9Q\n7D/EpcCnVmb5uDrxfG/tr4pRnq+r4A1JR4CMLXa0AylrWEuo8I/Xz5khfH5xxSA9\njTdG+tFL9jA7lLRR34OOOf18OR1e2AtX3W9oFD9oK10Mqbc5vIzECW/uuCRgL+vS\nxjvLQOgVn2/xtIJtfxq3juQvsnXEYh0BpdaN8PfFGwKBgQDvJaUQqNwqshC/0lvD\nZOli7nujdldZkdlMGwtpS4xSq5qmIzvhahFz+qh4JXK0+GyGAxTTQ+wg11r6BOl3\nFcC1iu938gwmOmschKEzwOhWeE/Kdq/QmxDR6bB7vsOcbY5sBXkzsatB2cT0Lqko\nqgTZp5BraYuJBxe7uy83eEg8zwKBgQDtMVK2irv9f5Sv0nuhZUDjYE5CanlORKNr\npdY+QwW/9aey5n/ogUxZJjSHO0jUTG8IGPHnI9emQtsMnwn4fdQrky1mvvZh9Vr7\n6OGopB/k2FHoX4g0HnAl9/+JhGs6O837TOMgDjMy8fwDWJCcw5EUqGF9/OYTdfx9\nuZm8YZhCFwKBgB8RYupRJZkeXPKun2E5AODrXoCT5TErs3Ehqk/ZkrdCt+qRdTwJ\njY7lp3FEXCyKgX6/c7smfcyebaFBdhsUZl6vWADbHxzwRe4EhPS2QPjK1ILW/Gw7\nWOoMU/Mfi0YNLY13AJHoqPj7E40taqhvvgWQsUBjC8+XbkvjO3UXWTsdAoGBAM+O\n+sdcLddNvkoBUUhRd2/BRZpe29n+vFal3w3KzoxFJkOp6sIF606T3SF9YmTModif\nI4fVWI9YL6EixrHZQkIDX5ZqguYDs2N/TYCqZnJ2TW6fsmuROygulUG8S6zAyqYe\niR3y7yCkmpg+9wUHKby+/9kk5hyfgZxvPrWXXYpvAoGBAJgqcMg5jmXQsR7n9+pQ\nbTcDg1qIkL6pwpQKXurSz2NixOrlL+rOcCxVp6a1GpfoHV50IxJvYTmwR4au2lLb\nW+aTtvjty+yZapXNBJRf5rAq5H4q/Oe7FC4Mw5kqEbhycW6bHiP+At8gN2OTOceu\nxEdPRcKVuzjqozkgwU75fxar\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-1678h@nexync-zenith.iam.gserviceaccount.com",
    "client_id": "116256521364423510596",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1678h%40nexync-zenith.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}

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
