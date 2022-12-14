import {NextFunction, Request, Response} from "express";
import {body, validationResult, CustomValidator, oneOf} from 'express-validator';
import {blogsService} from "../services/blogs-service";
import {usersService} from "../services/users-service";
import {postsService} from "../services/posts-service";
import {QueryParamsModel} from "../models/query-params-model";
import {ErrorsType} from "../types/errors-type";
import {SortDirection} from "mongodb";
import {authService} from "../services/auth-service";

export const queryParamsValidation = async (req: Request, res: Response, next: NextFunction) => {
    const searchNameTerm = req.query.searchNameTerm || '';
    const searchLoginTerm = req.query.searchLoginTerm || '';
    const searchEmailTerm = req.query.searchEmailTerm || '';
    const pageNumber = req.query.pageNumber || 1;
    const pageSize = req.query.pageSize || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    let sortDirection: SortDirection = 'desc';
    if(String(req.query.sortDirection) === 'asc')
        sortDirection = 'asc';
    const params: QueryParamsModel = {
        searchNameTerm: String(searchNameTerm),
        searchLoginTerm: String(searchLoginTerm),
        searchEmailTerm: String(searchEmailTerm),
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
        sortBy: String(sortBy),
        sortDirection: sortDirection
    };
    if(params.pageNumber < 1)
        return res.status(400).send('Invalid pageNumber');
    if(params.pageSize < 1)
        return res.status(400).send('Invalid pageSize');
    req.searchParams = params;
    return next();
};
const isValidBlogTd: CustomValidator = async blogId => {
    const blog = await blogsService.findBlogById(String(blogId));
    if (blog)
        return true;
    else
        throw new Error('Blog with blogId does not exist');
};
export const blogIdIsExist = async (req: Request, res: Response, next: NextFunction) => {
    const post = await blogsService.findBlogById(String(req.params.id));
    if(post)
        return next();
    else
        return res.sendStatus(404);
};
export const postIdIsExist = async (req: Request, res: Response, next: NextFunction) => {
    const post = await postsService.findPostById(String(req.params.id));
    if(post)
        return next();
    else
        return res.sendStatus(404);
};
const checkCode: CustomValidator = async code => {
    const result = await authService.confirmEmail(code);
    if(result)
        return true;
    else
        throw new Error('Confirmation code is bad');
}
const loginIsFree: CustomValidator = async login => {
    const checkLogin = await usersService.findUser('accountData.login', login);
    if(checkLogin)
        throw new Error('Login already in use');
    else
        return true;
};
const emailIsFree: CustomValidator = async email => {
    const checkLogin = await usersService.findUser('accountData.email', email);
    if(checkLogin)
        throw new Error('Email already in use');
    else
        return true;
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
export const loginValidation = body('login').isLength({min: 3, max: 10})
    .matches('^[a-zA-Z0-9_-]*$').custom(loginIsFree);
export const emailValidation = body('email')
    .matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$').custom(emailIsFree);
export const passwordValidation = body('password').isLength({min: 6, max: 20});
export const contentCommentValidation = body('content').trim().isLength({min: 20, max: 300});
export const checkConfirmationCode = body('code').custom(checkCode);

export const errorsValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors: ErrorsType = {errorsMessages: []};
    for(let i = 0; i < validationResult(req).array({onlyFirstError: true}).length; i++) {
        errors.errorsMessages.push({
            message: validationResult(req).array({onlyFirstError: true})[i].msg,
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