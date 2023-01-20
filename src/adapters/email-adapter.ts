import nodemailer from "nodemailer";
import {settingsEnv} from "../config/settings-env";
import {injectable} from "inversify";

@injectable()
export class EmailAdapter {
    async sendEmail(email: string, subject: string, message: string) {
        let transport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: settingsEnv.EMAIL_LOGIN,
                pass: settingsEnv.EMAIL_PASS
            }
        });
        await transport.sendMail({
            from: `"Illuhs Team" <${settingsEnv.EMAIL_LOGIN}>`,
            to: email,
            subject: subject, //тема емейла
            html: message
        });
    };
}