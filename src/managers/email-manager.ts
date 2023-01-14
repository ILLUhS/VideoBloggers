import {UserCreateType} from "../types/create-model-types/user-create-type";
import {EmailAdapter} from "../adapters/email-adapter";
import {Buffer} from 'buffer';

export class EmailManager {
    constructor(protected emailAdapter: EmailAdapter) {
    }
    async sendEmailConfirmationMessage(user: UserCreateType) {
        const email = user.accountData.email;
        const subject = 'Confirm your registration';
        const code = Buffer.from(user.emailConfirmation.confirmationCode).toString('base64');
        const link = `https://video-bloggers.vercel.app/confirm-email?code=${code}`;
        const message = `<h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
            <a href=${link}>complete registration</a>
        </p>`
        await this.emailAdapter.sendEmail(email, subject, message);
    };
    async sendPassRecoveryMessage(email: string, recoveryCode: string) {
        const subject = 'Confirm your registration';
        const code = Buffer.from(recoveryCode).toString('base64');
        const link = `https://video-bloggers.vercel.app/password-recovery?recoveryCode=${code}`;
        const message = `<h1>You have chosen password recovery</h1>
        <p>To finish recovery please follow the link below:
            <a href=${link}>recovery password</a>
        </p>`
        await this.emailAdapter.sendEmail(email, subject, message);
    };
}