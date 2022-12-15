import {Request, Response, Router} from "express";
import {
    checkConfirmationCode, checkEmailResending,
    emailValidation,
    errorsValidation,
    loginOrEmailValidation,
    loginValidation, passwordValidation
} from "../middlewares/input-validation-middleware";
import {usersService} from "../services/users-service";
import {jwtService} from "../application/jwt-service";
import {authorizationBearerGuardMiddleware} from "../middlewares/authorization-bearer-guard-middleware";
import {authService} from "../services/auth-service";
import {checkRefreshTokenMiddleware} from "../middlewares/check-refresh-token-middleware";

export const authRouter = Router({});

authRouter.post('/login', loginOrEmailValidation, errorsValidation,
    async (req: Request, res: Response) => {
    const checkingUserId = await usersService.cechCredentials(String(req.body.loginOrEmail), String(req.body.password));
    if(checkingUserId) {
        const token = await jwtService.createAccessJWT(checkingUserId);
        const refreshToken = await jwtService.createRefreshJWT(checkingUserId);
        return res.status(200).json({"accessToken": token}).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/auth/refresh-token',
        });
    }
    else
        return res.sendStatus(401);
});
authRouter.get('/me', authorizationBearerGuardMiddleware, async (req: Request, res: Response) => {
    return res.status(200).json({
        email: req.user!.email,
        login: req.user!.login,
        userId: req.user!.id
    });
});
authRouter.post('/registration', loginValidation, passwordValidation, emailValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const userIsCreated = await authService.createUser(
            String(req.body.login),
            String(req.body.password),
            String(req.body.email)
        );
        if(userIsCreated)
            return res.sendStatus(204);
        else
            return res.status(409).send('Database write error');
});
authRouter.post('/registration-confirmation', checkConfirmationCode, errorsValidation,
    async (req: Request, res: Response) => {
        return res.sendStatus(204);
});
authRouter.post('/registration-email-resending', checkEmailResending, errorsValidation,
    async (req: Request, res: Response) => {
        return res.sendStatus(204);
});
authRouter.post('/refresh-token', checkRefreshTokenMiddleware,  async (req: Request, res: Response) => {
    const token = await jwtService.createAccessJWT(req.user!.id);
    const refreshToken = await jwtService.createRefreshJWT(req.user!.id);
    return res.status(200).json({"accessToken": token}).cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/auth/refresh-token',
    });
});
authRouter.post('/logout', checkRefreshTokenMiddleware,  async (req: Request, res: Response) => {
    return res.sendStatus(204);
});