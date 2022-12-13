import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import add from "date-fns/add";
import {usersRepository} from "../repositories/users-repository";
import {emailManager} from "../managers/email-manager";

export const authService = {
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
        const result = await usersRepository.create(newUser);
        try {
            await emailManager.sendEmailConfirmationMessage(newUser);
            return result;
        }
        catch (e) {
            console.log(e);
            await usersRepository.deleteById(newUser.id);
            return false;
        }
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}