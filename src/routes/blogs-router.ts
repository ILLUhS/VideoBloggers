import {Request, Response, Router} from "express";
import {authorizationGuardMiddleware} from "../middlewares/authorization-guard-middleware";
import {
        contentPostValidation,
        descriptionBlogValidation,
        errorsValidation,
        nameBlogValidation,
        queryParamsValidation,
        shortDescriptionPostValidation,
        titlePostValidation,
        websiteUrlBlogValidation
} from "../middlewares/input-validation-middleware";
import {queryRepository} from "../repositories/query-repository";
import {blogsService} from "../services/blogs-service";
import {postsService} from "../services/posts-service";

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
blogsRouter.get('/:id/posts', async (req: Request, res: Response) => {
        const foundBlog = await queryRepository.findBlogById(String(req.params.id));
        if(foundBlog) {
                const searchParams = queryParamsValidation(req.query);
                return res.status(200).json(await queryRepository.getPotsWithQueryParamAndBlogId(searchParams,
                    String(req.params.id)));
        }
        return res.status(404).send('If specified blog doesn\'t exists')
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
blogsRouter.post('/:id/posts', authorizationGuardMiddleware,
    titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
            const foundBlog = await queryRepository.findBlogById(String(req.params.id));
            if(foundBlog) {
                    const createdPost = await postsService.createPost(
                        String(req.body.title),
                        String(req.body.shortDescription),
                        String(req.body.content), String(req.body.blogId)
                    );
                    return res.status(201).json(createdPost)
            }
            return res.status(404).send('If specified blog doesn\'t exists')
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