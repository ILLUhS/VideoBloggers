import {Request, Response, Router} from "express";
import {authorizationGuardMiddleware} from "../middlewares/authorization-guard-middleware";
import {blogsRepository} from "../repositories/blogs-repository";
import {
        descriptionBlogValidation, errorsValidation,
        nameBlogValidation,
        websiteUrlBlogValidation
} from "../middlewares/input-validation-middleware";

export const blogsRouter = Router({});

blogsRouter.get('/', async (req, res) => {
        return res.status(200).json(await blogsRepository.returnAllBlogs());
})
blogsRouter.get('/:id', async (req, res) => {
        const foundBlog = await blogsRepository.findBlogById(String(req.params.id));
        if(foundBlog) {
                return res.status(200).json(foundBlog);
        }
        else {
                return res.sendStatus(404);
        }
})
blogsRouter.delete('/:id', authorizationGuardMiddleware, async (req, res) => {
        const deletedBlog = await blogsRepository.deleteBlogByTd(String(req.params.id));
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
        const createdBlog = await blogsRepository.createBlog(String(req.body.name), String(req.body.description), String(req.body.websiteUrl));
        return res.status(201).json(createdBlog)
})
blogsRouter.put('/:id', authorizationGuardMiddleware, nameBlogValidation,
    descriptionBlogValidation, websiteUrlBlogValidation, errorsValidation,
    async (req: Request, res: Response) => {
            const updatedBlog = await blogsRepository.updateBlog(String(req.params.id), String(req.body.name),
                String(req.body.description), String(req.body.websiteUrl));
            if(updatedBlog) {
                    return res.sendStatus(204);
            }
            else {
                    return res.sendStatus(404);
            }
})