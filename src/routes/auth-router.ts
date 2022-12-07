import {Request, Response, Router} from "express";
import {errorsValidation, loginOrEmailValidation} from "../middlewares/input-validation-middleware";
import {usersService} from "../services/users-service";
import {jwyService} from "../application/jwy-service";
import {authorizationBearerGuardMiddleware} from "../middlewares/authorization-bearer-guard-middleware";

export const authRouter = Router({});

authRouter.post('/login', loginOrEmailValidation, errorsValidation,
    async (req: Request, res: Response) => {
    const checkingUserId = await usersService.cechCredentials(String(req.body.loginOrEmail), String(req.body.password));
    if(checkingUserId) {
        const token = await jwyService.createJWT(checkingUserId);
        return res.status(200).json({"accessToken": token});
    }
    else
        return res.sendStatus(401);
});
authRouter.get('/me', authorizationBearerGuardMiddleware, async (req: Request, res: Response) => {
    const user = req.user!;
    const userForResponse = {
        email: user.email,
        login: user.login,
        userId: user.id
    };
    return res.status(200).json(userForResponse);
});