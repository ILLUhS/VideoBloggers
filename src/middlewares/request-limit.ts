import {NextFunction, Request, Response} from "express";
import {RequestListType} from "../types/request-list-type";
let requestArr:RequestListType[] = [];
export const requestLimit = async (req: Request, res: Response, next: NextFunction) => {
        const newRequest: RequestListType = {
        ip: req.ip,
        path: req.baseUrl + req.path,
        date: (new Date()).valueOf()
    };
    const arr = requestArr.filter(r => (r.date + 10000) >= newRequest.date &&
        r.ip === newRequest.ip && r.path === newRequest.path);
    requestArr.push(newRequest);
    if(arr.length < 5) {
        requestArr = requestArr.filter(r => (r.date + 10000) >= newRequest.date);
        return next();
    }
    return res.sendStatus(429);
}