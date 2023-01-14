import {NextFunction, Request, Response} from "express";
import {jwtService} from "../composition-root";

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.cookies.refreshToken)
        return res.sendStatus(401);
    const payload = await jwtService.getPayloadByRefreshToken(req.cookies.refreshToken);
    if (!payload)
        return res.sendStatus(401);
    req.payload = payload;
    return next();

}