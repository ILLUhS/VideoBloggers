import {Request, Response, Router} from "express";
import {errorsValidation, loginOrEmailValidation} from "../middlewares/input-validation-middleware";
import {usersService} from "../services/users-service";
import {jwyService} from "../application/jwy-service";

export const authRouter = Router({});
authRouter.post('/login', loginOrEmailValidation, errorsValidation,
    async (req: Request, res: Response) => {
    const checkingUserId = await usersService.cechCredentials(String(req.body.loginOrEmail), String(req.body.password));
    if(checkingUserId) {
        const token = await jwyService.createJWT(checkingUserId);
        return res.status(200).json(token);
    }
    else
        return res.sendStatus(401);
})