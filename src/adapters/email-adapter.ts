import nodemailer from "nodemailer";
import {settings} from "../config/settings";
export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            host: 'app.debugmail.io',
            port: 25,
            auth: {
                user: settings.EMAIL_LOGIN,
                pass: settings.EMAIL_PASS
            }
        });
        await transport.sendMail({
            from: '"Illuhs Team" <centfrost@protonmail.com>',
            to: email,
            subject: subject, //тема емейла
            html: message
        });
    }
}