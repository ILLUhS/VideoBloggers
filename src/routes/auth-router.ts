import {Request, Response, Router} from "express";
import {
    checkConfirmationCode, checkEmailForPass, checkEmailResending,
    emailValidation, errorsValidation, loginOrEmailValidation,
    loginValidation, newPassValidation, passwordValidation, recoveryCodeValidation
} from "../middlewares/input-validation";
import {authorizationBearerGuard} from "../middlewares/authorization-bearer-guard";
import {checkRefreshToken} from "../middlewares/check-refresh-token";
import {requestLimit} from "../middlewares/request-limit";
import {authService, jwtService, usersService} from "../dependencies/composition-root";

export const authRouter = Router({});

authRouter.post('/login', requestLimit, loginOrEmailValidation, errorsValidation,
    async (req: Request, res: Response) => {
    const checkingUserId = await authService.cechCredentials(String(req.body.loginOrEmail), String(req.body.password));
    if(checkingUserId) {
        const token = await jwtService.createAccessJWT(checkingUserId);
        const refreshToken = await jwtService.createRefreshJWT(checkingUserId, String(req.headers['user-agent']), req.ip);
        return res.status(200).cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            path: '/auth/refresh-token',
        }).json({"accessToken": token});
    }
    else
        return res.sendStatus(401);
});
authRouter.get('/me', authorizationBearerGuard, async (req: Request, res: Response) => {
    return res.status(200).json({
        email: req.user!.email,
        login: req.user!.login,
        userId: req.user!.id
    });
});
authRouter.post('/registration', requestLimit, loginValidation, passwordValidation, emailValidation, errorsValidation,
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
authRouter.post('/registration-confirmation', requestLimit, checkConfirmationCode, errorsValidation,
    async (req: Request, res: Response) => {
        return res.sendStatus(204);
});
authRouter.post('/registration-email-resending', requestLimit, checkEmailResending, errorsValidation,
    async (req: Request, res: Response) => {
        return res.sendStatus(204);
});
authRouter.post('/refresh-token', checkRefreshToken,  async (req: Request, res: Response) => {
    const token = await jwtService.createAccessJWT(req.payload!.userId);
    const refreshToken = await jwtService.reCreateRefreshJWT(req.payload!.userId, req.payload!.deviceId, req.ip);
    return res.status(200).cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        path: '/auth/refresh-token',
    }).json({"accessToken": token});
});
authRouter.post('/logout', checkRefreshToken,  async (req: Request, res: Response) => {
    const metaIsDeleted = await jwtService.deleteOneTokensMeta(req.payload!.userId, req.payload!.deviceId);
    if(metaIsDeleted)
        return res.sendStatus(204);
    else
        return res.status(409).send('Database write error');
});
authRouter.post('/password-recovery', requestLimit, checkEmailForPass, errorsValidation,
    async (req: Request, res: Response) => {
        await authService.passRecovery(req.body.email);
        return res.sendStatus(204);
});
authRouter.post('/new-password', requestLimit, newPassValidation, recoveryCodeValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const recoveryCode = Buffer.from(req.body.recoveryCode, "base64").toString("ascii");
        const user = await usersService.findUser('passwordRecovery.recoveryCode', recoveryCode)
        await authService.setNewPassword(user!.id, req.body.newPassword);
        return res.sendStatus(204);
});