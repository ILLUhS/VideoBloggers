import {Request, Response, Router} from "express";
import {checkRefreshToken} from "../middlewares/check-refresh-token";
import {sessionsService} from "../services/sessions-service";
import {checkOwnerDevice} from "../middlewares/check-owner-device";

export const securityDevicesRouter = Router({});

securityDevicesRouter.get('/', checkRefreshToken, async (req: Request, res: Response) => {
    return res.status(200).json(await sessionsService.getAllByUserId(req.payload!.userId));
});
securityDevicesRouter.delete('/', checkRefreshToken, async (req: Request, res: Response) => {
    const isDeleted = await sessionsService.deleteAllExceptCurrent(req.payload!.userId, req.payload!.deviceId);
    if(isDeleted)
        return res.sendStatus(204);
    else
        return res.status(409).send('Database write error');
});
securityDevicesRouter.delete('/:id', checkRefreshToken, checkOwnerDevice,
    async (req: Request, res: Response) => {
    const isDeleted = await sessionsService.deleteById(req.params.id);
    if(isDeleted)
        return res.sendStatus(204);
    else
        return res.sendStatus(404);
});