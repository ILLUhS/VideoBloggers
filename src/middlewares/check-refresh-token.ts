import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../services/users-service";

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.cookies.refreshToken)
        return res.sendStatus(401);
    const userId = await jwtService.getUserIdByRefreshToken(req.cookies.refreshToken);
    if (!userId)
        return res.sendStatus(401);
    await jwtService.addRefreshTokenInBlackList(req.cookies.refreshToken);
    const user = await usersService.findUser('id', userId);
    if(user) {
        req.user = user;
        return next();
    }
    return res.sendStatus(401);
}