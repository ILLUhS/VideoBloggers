import {Request, Response, Router} from "express";
import {errorsValidation, loginOrEmailValidation} from "../middlewares/input-validation-middleware";
import {usersService} from "../services/users-service";

export const authRouter = Router({});
authRouter.post('/login', loginOrEmailValidation, errorsValidation,
    async (req: Request, res: Response) => {
    const checkLogPass = await usersService.cechCredentials(String(req.body.loginOrEmail), String(req.body.password));
    if(checkLogPass)
        return res.sendStatus(204);
    else
        return res.sendStatus(401);
})