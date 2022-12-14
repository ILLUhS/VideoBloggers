import {UserCreateModel} from "../models/user-create-model";
import {emailAdapter} from "../adapters/email-adapter";
import { Buffer } from 'buffer';

export const emailManager = {
    async sendEmailConfirmationMessage(user: UserCreateModel) {
        const email = user.accountData.email;
        const subject = 'Confirm your registration';
        const code = Buffer.from(user.emailConfirmation.confirmationCode).toString('base64');
        const link = `https://video-bloggers.vercel.app/confirm-email?code=${code}`;
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href=${link}>complete registration</a>
        </p>`
        await emailAdapter.sendEmail(email,subject, message);
    }
}