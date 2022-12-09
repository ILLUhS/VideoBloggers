import {NextFunction, Request, Response} from "express";
import {body, validationResult, CustomValidator, oneOf} from 'express-validator';
import {blogsService} from "../services/blogs-service";
import {usersService} from "../services/users-service";
import {postsService} from "../services/posts-service";
import {QueryParamsModel} from "../models/query-params-model";
import {ErrorsModel} from "../models/errors-model";

export const queryParamsValidation = async (req: Request, res: Response, next: NextFunction) => {
    const params: QueryParamsModel = {
        searchNameTerm: String(req.query.searchNameTerm) || '',
        searchLoginTerm: String(req.query.searchLoginTerm) || '',
        searchEmailTerm: String(req.query.searchEmailTerm) || '',
        pageNumber: Number(req.query.pageNumber) || 1,
        pageSize: Number(req.query.pageSize) || 10,
        sortBy: String(req.query.sortBy) || 'createdAt',
        sortDirection: 'desc'
    };
    if(String(req.query.sortDirection) === 'asc')
        params.sortDirection = 'asc';
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
const loginIsFree: CustomValidator = async login => {
    const checkLogin = await usersService.findUser('login', login);
    if(checkLogin)
        throw new Error('Login already in use');
    else
        return true;
};
const emailIsFree: CustomValidator = async email => {
    const checkLogin = await usersService.findUser('email', email);
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

export const errorsValidation = (req: Request, res: Response, next: NextFunction) => {
    const errors: ErrorsModel = {errorsMessages: []};
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