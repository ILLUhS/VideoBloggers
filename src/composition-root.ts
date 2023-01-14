import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./services/users-service";
import {AuthService} from "./services/auth-service";
import {EmailAdapter} from "./adapters/email-adapter";
import {EmailManager} from "./managers/email-manager";
import {ReactionsRepository} from "./repositories/reactions-repository";
import {LikeService} from "./services/like-service";
import {RefreshTokensMetaRepository} from "./repositories/refresh-tokens-meta-repository";
import {JwtService} from "./application/jwt-service";
import {SessionsService} from "./services/sessions-service";
import {BlogsRepository} from "./repositories/blogs-repository";
import {BlogsService} from "./services/blogs-service";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./services/posts-service";

const usersRepository = new UsersRepository();
const reactionsRepository = new ReactionsRepository();
const refreshTokensMetaRepository = new RefreshTokensMetaRepository();
const blogsRepository = new BlogsRepository();
const postsRepository = new PostsRepository();
const emailAdapter = new EmailAdapter();
const emailManager = new EmailManager(emailAdapter);
export const usersService = new UsersService(usersRepository, refreshTokensMetaRepository);
export const authService = new AuthService(usersRepository, emailManager);
export const likeService = new LikeService(reactionsRepository);
export const jwtService = new JwtService(refreshTokensMetaRepository);
export const sessionsService = new SessionsService(refreshTokensMetaRepository);
export const postsService = new PostsService(postsRepository);
export const blogsService = new BlogsService(blogsRepository, postsService);