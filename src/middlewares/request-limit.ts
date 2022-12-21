import {NextFunction, Request, Response} from "express";
import {RequestList} from "../types/request-list";
let requestArr:RequestList[] = [];
export const requestLimit = async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.ip);
    const newRequest: RequestList = {
        ip: req.ip,
        path: req.baseUrl + req.path,
        date: (new Date()).valueOf()
    };
    const arr = requestArr.filter(r => (r.date + 10000) >= newRequest.date &&
        r.ip === newRequest.ip && r.path === newRequest.path);
    if(arr.length < 5) {
        requestArr = requestArr.filter(r => (r.date + 10000) >= newRequest.date);
        requestArr.push(newRequest);
        return next();
    }
    return res.sendStatus(429);
}