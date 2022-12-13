import bcrypt from 'bcrypt'
import {v4 as uuidv4} from "uuid";
import {usersRepository} from "../repositories/users-repository";
import add from "date-fns/add";
export const usersService = {
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
                isConfirmed: true
            }
        };
        const result = await usersRepository.create(newUser);
        return result ? newUser.id : null;
    },
    async cechCredentials(loginOrEmail: string, password: string) {
        const user = await usersRepository
            .findByFieldWithHash(`accountData.${await this.isLoginOrEmail(loginOrEmail)}`, loginOrEmail);
        if(!user)
            return null;
        const passwordHash = await this._generateHash(password, user.accountData.passwordHash.substring(0,30));
        const confirmed = user.emailConfirmation.isConfirmed;
        if(!confirmed)
            return null;
        return user.accountData.passwordHash === passwordHash ? user.id : null;
    },
    async isLoginOrEmail(loginOrEmail: string) {
        return loginOrEmail.includes('@') ? 'email' : 'login';
    },
    async findUser(field: string, value: string) {
        return await usersRepository.findByField(field, value);
    },
    async deleteUserById(id: string) {
        return await usersRepository.deleteById(id);
    },
    async deleteAllUsers() {
        return await usersRepository.deleteAll();
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}