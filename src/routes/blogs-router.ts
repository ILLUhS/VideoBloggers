import {Request, Response, Router} from "express";
import {authorizationGuardMiddleware} from "../middlewares/authorization-guard-middleware";
import {
        contentPostValidation,
        descriptionBlogValidation,
        errorsValidation,
        nameBlogValidation,
        shortDescriptionPostValidation,
        titlePostValidation,
        websiteUrlBlogValidation
} from "../middlewares/input-validation-middleware";
import {queryRepository} from "../repositories/query-repository";
import {blogsService} from "../services/blogs-service";
export const blogsRouter = Router({});

blogsRouter.get('/', async (req: Request, res: Response) => {
        return res.status(200).json(await queryRepository.getBlogsWithQueryParam(req.query));
});
blogsRouter.get('/:id', async (req, res) => {
        const foundBlog = await queryRepository.findBlogById(String(req.params.id));
        if(foundBlog)
            return res.status(200).json(foundBlog);
        else
            return res.status(404).send('If specified blog doesn\'t exists');
});
blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
        const foundPosts = await queryRepository.getPotsWithQueryParamAndBlogId(
            req.query,
            String(req.params.id));
        if(foundPosts.items.length > 0)
            return res.status(200).json(foundPosts);
        else
            return res.status(404).send('If specified blog doesn\'t exists');
});
blogsRouter.delete('/:id', authorizationGuardMiddleware, async (req, res) => {
        const deletedBlog = await blogsService.deleteBlogByTd(String(req.params.id));
        if(deletedBlog)
            return res.sendStatus(204);
        else
            return res.sendStatus(404);
});
blogsRouter.post('/', authorizationGuardMiddleware, nameBlogValidation,
    descriptionBlogValidation, websiteUrlBlogValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const createdBlogId = await blogsService.createBlog(String(req.body.name),
            String(req.body.description), String(req.body.websiteUrl));
        if(createdBlogId)
            return res.status(201).json(await queryRepository.findBlogById(createdBlogId));
        else
            return res.status(409).send('Database write error');
});
blogsRouter.post('/:id/posts', authorizationGuardMiddleware,
    titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
            const createdPostIdByBlogId = await blogsService.createPostByBlogId(
                String(req.body.title),
                String(req.body.shortDescription),
                String(req.body.content),
                String(req.params.id)
            );
        if(createdPostIdByBlogId && createdPostIdByBlogId.length > 0)
            return res.status(201).json(await queryRepository.findPostById(createdPostIdByBlogId))
        else if(createdPostIdByBlogId && createdPostIdByBlogId.length === 0)
            return res.status(409).send('Database write error');
        else
            return res.status(404).send('If specified blog doesn\'t exists');
});
blogsRouter.put('/:id', authorizationGuardMiddleware, nameBlogValidation,
    descriptionBlogValidation, websiteUrlBlogValidation, errorsValidation,
    async (req: Request, res: Response) => {
            const updatedBlog = await blogsService.updateBlog(String(req.params.id), String(req.body.name),
                String(req.body.description), String(req.body.websiteUrl));
            if(updatedBlog)
                return res.sendStatus(204);
            else
                return res.sendStatus(404);
});