import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../services/users-service";

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.cookies.refreshToken)
        return res.sendStatus(401);
    const payload = await jwtService.getPayloadByRefreshToken(req.cookies.refreshToken);
    if (!payload)
        return res.sendStatus(401);
    const user = await usersService.findUser('id', payload.userId);
    if(user) {
        req.user = user;
        return next();
    }
    return res.sendStatus(401);
}