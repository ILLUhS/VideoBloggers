import bcrypt from 'bcrypt'
import {v4 as uuidv4} from "uuid";
import {UsersRepository} from "../repositories/users-repository";
import add from "date-fns/add";
import {RefreshTokensMetaRepository} from "../repositories/refresh-tokens-meta-repository";
import {inject, injectable} from "inversify";

@injectable()
export class UsersService {
    constructor(@inject(UsersRepository)
                protected usersRepository: UsersRepository,
                @inject(RefreshTokensMetaRepository)
                protected refreshTokensMetaRepository: RefreshTokensMetaRepository) { };
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
        const result = await this.usersRepository.create(newUser);
        return result ? newUser.id : null;
    };
    async findUser(field: string, value: string) {
        return await this.usersRepository.findByField(field, value);
    };
    async deleteUserById(id: string) {
        await this.refreshTokensMetaRepository.deleteById(id);
        return await this.usersRepository.deleteById(id);
    };
    async deleteAllUsers() {
        await this.refreshTokensMetaRepository.deleteAll();
        return await this.usersRepository.deleteAll();
    };
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt);
    };
}