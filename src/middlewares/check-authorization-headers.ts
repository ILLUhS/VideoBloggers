import {NextFunction, Request, Response} from "express";
import {jwtService, usersService} from "../dependencies/composition-root";

export const checkAuthorizationHeaders = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization)
        return next();
    const token = req.headers.authorization.split(' ')[1];
    const userId = await jwtService.getUserIdByToken(token);
    if (!userId)
        return next();
    const user = await usersService.findUser('id', userId);
    if(user) {
        req.user = user;
        return next();
    }
    return next();
}