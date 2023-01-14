import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./services/users-service";
import {AuthService} from "./services/auth-service";
import {EmailAdapter} from "./adapters/email-adapter";
import {EmailManager} from "./managers/email-manager";
import {ReactionsRepository} from "./repositories/reactions-repository";
import {LikeService} from "./services/like-service";

const usersRepository = new UsersRepository();
const reactionsRepository = new ReactionsRepository();
const emailAdapter = new EmailAdapter();
const emailManager = new EmailManager(emailAdapter);
export const usersService = new UsersService(usersRepository);
export const authService = new AuthService(usersRepository, emailManager);
export const likeService = new LikeService(reactionsRepository);