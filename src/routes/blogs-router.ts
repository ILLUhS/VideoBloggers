import {Request, Response, Router} from "express";
import {authorizationBasicGuardMiddleware} from "../middlewares/authorization-basic-guard-middleware";
import {
    blogIdIsExist,
    contentPostValidation,
    descriptionBlogValidation,
    errorsValidation,
    nameBlogValidation, queryParamsValidation,
    shortDescriptionPostValidation,
    titlePostValidation,
    websiteUrlBlogValidation
} from "../middlewares/input-validation-middleware";
import {queryRepository} from "../repositories/query-repository";
import {blogsService} from "../services/blogs-service";
export const blogsRouter = Router({});

blogsRouter.get('/', queryParamsValidation, async (req: Request, res: Response) => {
        return res.status(200).json(await queryRepository.getBlogsWithQueryParam(req.searchParams!));
});
blogsRouter.get('/:id', async (req, res) => {
        const foundBlog = await queryRepository.findBlogById(String(req.params.id));
        if(foundBlog)
            return res.status(200).json(foundBlog);
        else
            return res.sendStatus(404);
});
blogsRouter.get('/:id/posts', blogIdIsExist, queryParamsValidation, async (req: Request, res: Response) => {
        const foundPosts = await queryRepository.getPotsWithQueryParam(
            req.searchParams!, {blogId: String(req.params.id)});
        return res.status(200).json(foundPosts);
});
blogsRouter.delete('/:id', authorizationBasicGuardMiddleware, async (req, res) => {
        const deletedBlog = await blogsService.deleteBlogByTd(String(req.params.id));
        if(deletedBlog)
            return res.sendStatus(204);
        else
            return res.sendStatus(404);
});
blogsRouter.post('/', authorizationBasicGuardMiddleware, nameBlogValidation,
    descriptionBlogValidation, websiteUrlBlogValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const createdBlogId = await blogsService.createBlog(String(req.body.name),
            String(req.body.description), String(req.body.websiteUrl));
        if(createdBlogId)
            return res.status(201).json(await queryRepository.findBlogById(createdBlogId));
        else
            return res.status(409).send('Database write error');
});
blogsRouter.post('/:id/posts', authorizationBasicGuardMiddleware, blogIdIsExist,
    titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const createdPostIdByBlogId = await blogsService.createPostByBlogId(
            String(req.body.title),
            String(req.body.shortDescription),
            String(req.body.content),
            String(req.params.id)
        );
        if(createdPostIdByBlogId)
            return res.status(201).json(await queryRepository.findPostById(createdPostIdByBlogId))
        else
            return res.status(409).send('Database write error');
});
blogsRouter.put('/:id', authorizationBasicGuardMiddleware, nameBlogValidation,
    descriptionBlogValidation, websiteUrlBlogValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const updatedBlog = await blogsService.updateBlog(String(req.params.id), String(req.body.name),
            String(req.body.description), String(req.body.websiteUrl));
        if(updatedBlog)
            return res.sendStatus(204);
        else
            return res.sendStatus(404);
});