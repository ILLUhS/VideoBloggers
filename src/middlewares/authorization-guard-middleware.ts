import {NextFunction, Request, Response} from "express";

export const authorizationGuardMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let logPass = req.get('Authorization');
    if(logPass) {
        if (logPass.substring(6) === "YWRtaW46cXdlcnR5") {
            next();
        }
    }
    res.sendStatus(401);
}