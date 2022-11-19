import {NextFunction, Request, Response} from "express";
import { body, validationResult } from 'express-validator';

type errorsMessagesType = {
    message: string;
    field: string;
}
type errorsType = {
    errorsMessages: errorsMessagesType[];
}

export const nameBlogValidation = body('name').trim().isLength({min: 1, max: 15}).withMessage({
    message: "bad input",
    field: "name"
});
export const descriptionValidation = body('description').trim().isLength({min: 1, max: 15});
export const websiteUrlValidation = body('websiteUrl').isURL({protocols: ['https']}).isLength({max: 100});
export const errorsValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors: errorsType = {errorsMessages: []};
    for(let i = 0; i < validationResult(req).array().length; i++) {
        errors.errorsMessages.push({
            message: "bad input",
            field: validationResult(req).array()[i].param
        });
    }
    if(errors.errorsMessages.length){
        return res.status(400).json(errors)
    }
    else {
        return next();
    }
}


