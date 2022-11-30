import {Request, Response, Router} from "express";
import {authorizationGuardMiddleware} from "../middlewares/authorization-guard-middleware";
import {
        blogIdPostValidation,
        descriptionBlogValidation, errorsValidation,
        nameBlogValidation, queryParamsValidation, websiteUrlBlogValidation
} from "../middlewares/input-validation-middleware";
import {queryRepository} from "../repositories/query-repository";
import {blogsService} from "../services/blogs-service";

export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request, res: Response) => {
        const searchParams = queryParamsValidation(req.query);
        return res.status(200).json(await queryRepository.getBlogsWithQueryParam(searchParams));
})
blogsRouter.get('/:id', async (req, res) => {
        const foundBlog = await queryRepository.findBlogById(String(req.params.id));
        if(foundBlog) {
                return res.status(200).json(foundBlog);
        }
        else {
                return res.sendStatus(404);
        }
})
blogsRouter.get('/:id/posts', blogIdPostValidation, async (req: Request, res: Response) => {
        const searchParams = queryParamsValidation(req.query);
        return res.status(200).json(await queryRepository.getPotsWithQueryParamAndBlogId(searchParams,
            String(req.params.id)));
})
blogsRouter.delete('/:id', authorizationGuardMiddleware, async (req, res) => {
        const deletedBlog = await blogsService.deleteBlogByTd(String(req.params.id));
        if(deletedBlog) {
                return res.sendStatus(204);
        }
        else {
                return res.sendStatus(404);
        }
})
blogsRouter.post('/', authorizationGuardMiddleware, nameBlogValidation,
    descriptionBlogValidation, websiteUrlBlogValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const createdBlog = await blogsService.createBlog(String(req.body.name),
            String(req.body.description), String(req.body.websiteUrl));
        return res.status(201).json(createdBlog)
})
blogsRouter.put('/:id', authorizationGuardMiddleware, nameBlogValidation,
    descriptionBlogValidation, websiteUrlBlogValidation, errorsValidation,
    async (req: Request, res: Response) => {
            const updatedBlog = await blogsService.updateBlog(String(req.params.id), String(req.body.name),
                String(req.body.description), String(req.body.websiteUrl));
            if(updatedBlog) {
                    return res.sendStatus(204);
            }
            else {
                    return res.sendStatus(404);
            }
})