import bcrypt from 'bcrypt'
import {v4 as uuidv4} from "uuid";
import {usersRepository} from "../repositories/users-repository";
export const usersService = {
    async createUser(login: string, password: string, email: string) {
        const passwordSalt = await bcrypt.genSalt();
        const passwordHash = await this._generateHash(password, passwordSalt);
        const newUser = {
            id: uuidv4(),
            login: login,
            passwordHash: passwordHash,
            email: email,
            createdAt: new Date().toISOString()
        }
        const result = await usersRepository.createUser(newUser);
        return result ? newUser.id : null;
    },
    async deleteUserById(id: string) {
        return await usersRepository.deleteUserById(id);
    },
    async deleteAllUsers() {
        return await usersRepository.deleteAllUsers();
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    }
}