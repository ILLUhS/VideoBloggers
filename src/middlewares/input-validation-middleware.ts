import {NextFunction, Request, Response} from "express";
import {body, validationResult, CustomValidator, oneOf} from 'express-validator';
import {queryRepository} from "../repositories/query-repository";

type errorsMessagesType = {
    message: string;
    field: string;
};
type errorsType = {
    errorsMessages: errorsMessagesType[];
};
const isValidBlogTd: CustomValidator = async blogId => {
    const blog = await queryRepository.findBlogById(String(blogId));
    if (blog) {
        return true;
    } else {
        throw new Error('Blog with blogId does not exist');
    }
};
export const nameBlogValidation = body('name').trim().isLength({min: 1, max: 15});
export const descriptionBlogValidation = body('description').trim().isLength({min: 1, max: 500});
export const websiteUrlBlogValidation = body('websiteUrl').isURL({protocols: ['https']}).isLength({max: 100});
export const titlePostValidation = body('title').trim().isLength({min: 1, max: 30});
export const shortDescriptionPostValidation = body('shortDescription').trim().isLength({min: 1, max: 100});
export const contentPostValidation = body('content').trim().isLength({min: 1, max: 1000});
export const blogIdPostValidation = body('blogId').custom(isValidBlogTd);
export const loginOrEmailValidation = oneOf([
    body('loginOrEmail').isLength({min: 3, max: 10}).matches('^[a-zA-Z0-9_-]*$'),
    body('loginOrEmail').matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'),
]);
export const loginValidation = body('login').isLength({min: 3, max: 10}).matches('^[a-zA-Z0-9_-]*$');
export const emailValidation = body('email').matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
export const passwordValidation = body('password').isLength({min: 6, max: 20});

export const errorsValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors: errorsType = {errorsMessages: []};
    for(let i = 0; i < validationResult(req).array({onlyFirstError: true}).length; i++) {
        errors.errorsMessages.push({
            message: "bad input",
            field: validationResult(req).array({onlyFirstError: true})[i].param
        });
    }
    if(errors.errorsMessages.length){
        return res.status(400).json(errors)
    }
    else {
        return next();
    }
}