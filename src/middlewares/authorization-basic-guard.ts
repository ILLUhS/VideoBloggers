import {NextFunction, Request, Response} from "express";

export const authorizationBasicGuard = (req: Request, res: Response, next: NextFunction) => {
    let logPass = req.get('Authorization');
    if(logPass) {
        if (logPass.substring(6) === "YWRtaW46cXdlcnR5") {
            return next();
        }
    }
    return res.sendStatus(401);
}