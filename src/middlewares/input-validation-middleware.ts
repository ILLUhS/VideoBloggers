import {NextFunction, Request, Response} from "express";
import {body, validationResult, CustomValidator} from 'express-validator';
import {blogsRepository} from "../repositories/blogs-repository";

type errorsMessagesType = {
    message: string;
    field: string;
};
type errorsType = {
    errorsMessages: errorsMessagesType[];
};
export type queryParamsType = {
    searchNameTerm?: string;
    pageNumber?: string;
    pageSize?: string;
    sortBy?: string;
    sortDirection?: string;
};
export type searchParamsBlogs = {
    searchNameTerm: string;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: string;
};
const isValidBlogTd: CustomValidator = async blogId => {
    const blog = await blogsRepository.findBlogById(String(blogId));
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

export const queryParamsValidation = (queryParams: queryParamsType): searchParamsBlogs => {
    const searchNameTerm = queryParams.searchNameTerm || '';
    const pageNumber = queryParams.pageNumber || 1;
    const pageSize = queryParams.pageSize || 10;
    const sortBy = queryParams.sortBy || 'createdAt';
    let sortDirection = String(queryParams.sortDirection);
    if(sortDirection !== 'asc' && sortDirection !== 'desc') {
        sortDirection = 'desc';
    }
    return {
        searchNameTerm: String(searchNameTerm),
        pageNumber: Number(pageNumber),
        pageSize: Number(pageSize),
        sortBy: String(sortBy),
        sortDirection: sortDirection
    };
}

