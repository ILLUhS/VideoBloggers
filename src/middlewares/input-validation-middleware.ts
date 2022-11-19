import {NextFunction, Request, Response} from "express";
import { body, validationResult } from 'express-validator';

export const nameBlogValidation = body('name').trim().isLength({min: 1, max: 15});
export const descriptionValidation = body('description').trim().isLength({min: 1, max: 15});
export const websiteUrlValidation = body('websiteUrl').isURL({protocols: ['https']}).isLength({max: 100});
export const myValidationResult = validationResult.withDefaults({
    formatter: error => {
        return {
            "message": error.msg,
            "field": error.location
        };
    },
});
export const errorsValidation = (req: Request, res: Response, next: NextFunction) => {
    const errorsMessages = myValidationResult(req);
    if(!errorsMessages.isEmpty()){
        res.status(400).json(errorsMessages.mapped())
    }
}