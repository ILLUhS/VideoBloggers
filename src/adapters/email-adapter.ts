import nodemailer from "nodemailer";
import {settings} from "../config/settings";
export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: settings.EMAIL_LOGIN,
                pass: settings.EMAIL_PASS
            }
        });
        await transport.sendMail({
            from: `"Illuhs Team" <${settings.EMAIL_LOGIN}>`,
            to: email,
            subject: subject, //тема емейла
            html: message
        });
    }
}