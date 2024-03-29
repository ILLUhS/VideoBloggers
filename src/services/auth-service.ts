import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {UsersRepository} from "../repositories/users-repository";
import {EmailManager} from "../managers/email-manager";
import {inject, injectable} from "inversify";

@injectable()
export class AuthService {
    constructor(@inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(EmailManager) protected emailManager: EmailManager) { };
    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt();
        const passwordHash = await this._generateHash(password, passwordSalt);
        const newUser = {
            id: uuidv4(),
            accountData:{
                login: login,
                passwordHash: passwordHash,
                email: email,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationTime: add(new Date(), {hours: 24}),
                isConfirmed: false
            }
        };
        const result = await this.usersRepository.create(newUser);
        try {
            await this.emailManager.sendEmailConfirmationMessage(newUser);
            return result;
        }
        catch (e) {
            console.log(e);
            await this.usersRepository.deleteById(newUser.id);
            return false;
        }
    };
    async cechCredentials(loginOrEmail: string, password: string) {
        const user = await this.usersRepository
            .findByFieldWithHash(`accountData.${await this.isLoginOrEmail(loginOrEmail)}`, loginOrEmail);
        if(!user)
            return null;
        const passwordHash = await this._generateHash(password, user.accountData.passwordHash.substring(0,30));
        const confirmed = user.emailConfirmation.isConfirmed;
        if(!confirmed)
            return null;
        return user.accountData.passwordHash === passwordHash ? user.id : null;
    };
    async isLoginOrEmail(loginOrEmail: string) {
        return loginOrEmail.includes('@') ? 'email' : 'login';
    };
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    };
    async confirmEmailByCode(code: string): Promise<boolean> {
        code = Buffer.from(code, "base64").toString("ascii");
        const user = await this.usersRepository.findByFieldWithHash('emailConfirmation.confirmationCode', code);
        if(!user)
            return false;
        if(user.emailConfirmation.expirationTime <= new Date())
            return false;
        if(user.emailConfirmation.isConfirmed)
            return false;
        return await this.usersRepository.updateOneField({'id': user.id},
            {'emailConfirmation.isConfirmed': true});//set confirmation status as true
    };
    async confirmEmailResend(email: string): Promise<boolean> {
        const user = await this.usersRepository.findByFieldWithHash('accountData.email', email);
        if(!user)
            return false;
        if(user.emailConfirmation.isConfirmed)
            return false;
        user.emailConfirmation.confirmationCode = uuidv4();
        await this.usersRepository.updateOneField({'id': user.id},
            {'emailConfirmation.confirmationCode': user.emailConfirmation.confirmationCode});//update confirmation code
        try {
            await this.emailManager.sendEmailConfirmationMessage(user);
            await this.usersRepository.updateOneField({'id': user.id},
                {'emailConfirmation.expirationTime': add(new Date(), {hours: 24})});
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    };
    async passRecovery(email: string) {
        const user = await this.usersRepository.findByFieldWithHash('accountData.email', email);
        if(!user)
            return false;
        const recoveryCode  = uuidv4();
        const expirationTime = add(new Date(), {hours: 24});
        const isUsed = false;
        try {
            await this.usersRepository.updatePassRecovery(user.id, recoveryCode, expirationTime, isUsed);
            await this.emailManager.sendPassRecoveryMessage(email, recoveryCode);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    };
    async confirmPassRecoveryCode(code: string): Promise<boolean> {
        code = Buffer.from(code, "base64").toString("ascii");
        const user = await this.usersRepository.findByFieldWithHash('passwordRecovery.recoveryCode', code);
        if(!user)
            return false;
        if(!user.passwordRecovery)
            return false;
        if(user.passwordRecovery.expirationTime <= new Date())
            return false;
        if(user.passwordRecovery.isUsed)
            return false;
        return true;
    };
    async setNewPassword(id: string, newPassword: string) {
        await this.usersRepository.updateOneField({'id': id}, {'passwordRecovery.isUsed': true}); //update passwordRecovery status
        const passwordSalt = await bcrypt.genSalt();
        const newPasswordHash = await this._generateHash(newPassword, passwordSalt);
        return await this.usersRepository.updateOneField({'id': id}, {'accountData.passwordHash': newPasswordHash}); //update password hash
    };
}