import {NextFunction, Request, Response} from "express";
import {sessionsService} from "../services/sessions-service";

export const checkOwnerDevice = async (req: Request, res: Response, next: NextFunction) => {
    const isExist = await sessionsService.getByDeviceId(req.params.id);
    if(!isExist)
        return res.sendStatus(404);
    const sessions = await sessionsService.getAllByUserId(req.payload!.userId);
    const result = sessions.filter(s => s.deviceId === req.params.id);
    if(result.length > 0)
        return next();
    return res.sendStatus(403);
}