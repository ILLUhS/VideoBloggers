import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../composition-root";

export const authorizationBearerGuard = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization)
        return res.sendStatus(401);
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);
    if (!userId)
        return res.sendStatus(401);
    const user = await usersService.findUser('id', userId);
    if(user) {
        req.user = user;
        return next();
    }
    return res.sendStatus(401);
}