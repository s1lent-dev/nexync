import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';
import { MailContent, MailType } from '../types/types.js';
import { MAIL_FROM, MAIL_HOST, MAIL_PASS, MAIL_PORT, MAIL_SERVICE, MAIL_USER } from '../config/config.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const loadTemplate = (templateName: string, data: Record<string, any>) => {
    const filePath = path.join(__dirname, '../templates', `${templateName}.html`);
    const source = fs.readFileSync(filePath, 'utf-8');
    const template = handlebars.compile(source);
    return template(data);
}

const createMailOptions = ({email, contentType, content}: MailContent) => {
    let subject = '';
    let html = '';
    switch (contentType) {
        case MailType.CONFIRMATION:
            subject = 'Confirm your email';
            html = loadTemplate('confirmation', { email, content });
            break;
        case MailType.RESET_PASSWORD:
            subject = 'Reset your password';
            html = loadTemplate('reset_password', { email, content });
            break;
        case MailType.PASSWORD:
            subject = 'Password';
            html = loadTemplate('password', { email, content });
            break;
        case MailType.VERIFY_EMAIL:
            subject = 'Verify your email';
            html = loadTemplate('verify_email', { email, content });
            break;
        default:
            break;
    }
    return { subject, html };
}

const sendMail = async ({email, contentType, content} : MailContent) => {
    try {
        const transporter = nodemailer.createTransport({
            service: MAIL_SERVICE,
            host: MAIL_HOST,
            port: MAIL_PORT,
            secure: true,
            auth: {
                user: MAIL_USER,
                pass: MAIL_PASS
            }
        });
        const { subject, html } = createMailOptions({email, contentType, content});
        const mailOptions = {
            from: MAIL_FROM,
            to: email,
            subject,
            html
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(info.response);
    }
    catch (err) {
        console.log(err);
    }
}

export { sendMail };