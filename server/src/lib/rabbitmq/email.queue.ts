import { RabbitMQService } from "./rabbitmq.lib.js";
import { MailContent } from "../../types/types.js";
import { sendMail } from "../../services/mail.service.js";

class EmailQueue extends RabbitMQService {

    constructor() {
        super();
    }

    async initQueues() {
        await this.createQueue('reset-password');
        await this.createQueue("password-auto-create");
        await this.createQueue("welcome-email");
        await this.createQueue('verify-email');
    }

    async initConsumers() {
        await this.consumeWelcomeEmail();
        await this.consumePasswordResetEmail();
        await this.consumePasswordAutoCreateEmail();
        await this.consumeVerifyEmail();
    }


    async sendWelcomeEmail({email, contentType, content} : MailContent) {
        await this.publishMessage("welcome-email", { email, contentType, content });
    }

    async sendPasswordResetEmail({email, contentType, content} : MailContent) {
        await this.publishMessage("reset-password", { email, contentType, content });
    }

    async sendPasswordAutoCreateEmail({email, contentType, content} : MailContent) {
        await this.publishMessage("password-auto-create", { email, contentType, content });
    }

    async sendVerifyEmail({email, contentType, content} : MailContent) {
        await this.publishMessage("verify-email", { email, contentType, content });
    }



    async consumeWelcomeEmail() {
        await this.consumeMessage("welcome-email", async (msg) => {
            const emailData = JSON.parse(msg?.content.toString() || "") as MailContent;
            await sendMail(emailData);
        });
    }

    async consumePasswordResetEmail() {
        await this.consumeMessage("reset-password", async (msg) => {
            const emailData = JSON.parse(msg?.content.toString() || "") as MailContent;
            await sendMail(emailData);
        });
    }

    async consumePasswordAutoCreateEmail() {
        await this.consumeMessage("password-auto-create", async (msg) => {
            const emailData = JSON.parse(msg?.content.toString() || "") as MailContent;
            await sendMail(emailData);
        });
    }

    async consumeVerifyEmail() {
        await this.consumeMessage("verify-email", async (msg) => {
            const emailData = JSON.parse(msg?.content.toString() || "") as MailContent;
            await sendMail(emailData);
        });
    }
}

export { EmailQueue };