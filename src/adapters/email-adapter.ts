import nodemailer from "nodemailer";
import {settings} from "../config/settings";
export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transporter = nodemailer.createTransport({
            service: "DebugMail",
            auth: {
                user: 'centfrost@protonmail.com',
                pass: settings.EMAIL_PASS
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: '"Illuhs Team" <centfrost@protonmail.com>', // sender address
            to: email, // list of receivers
            subject: subject, // Subject line тема емейла
            html: message, // html body
        });
    }
}