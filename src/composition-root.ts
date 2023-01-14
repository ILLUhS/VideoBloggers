import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./services/users-service";
import {AuthService} from "./services/auth-service";
import {EmailAdapter} from "./adapters/email-adapter";
import {EmailManager} from "./managers/email-manager";

const usersRepository = new UsersRepository();
const emailAdapter = new EmailAdapter();
const emailManager = new EmailManager(emailAdapter);
export const usersService = new UsersService(usersRepository);
export const authService = new AuthService(usersRepository, emailManager);