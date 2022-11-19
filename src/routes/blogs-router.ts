import {Request, Response, Router} from "express";
import {authorizationGuardMiddleware} from "../middlewares/authorization-guard-middleware";
import {blogsRepository} from "../repositories/blogs-repository";
import {
        descriptionBlogValidation, errorsValidation,
        nameBlogValidation,
        websiteUrlBlogValidation
} from "../middlewares/input-validation-middleware";

export const blogsRouter = Router({});

blogsRouter.get('/', (req, res) => {
        return res.status(200).json(blogsRepository.returnAllBlogs());
})
blogsRouter.get('/:id', (req, res) => {
        const foundBlog = blogsRepository.findBlogById(Number(req.params.id));
        if(foundBlog) {
                return res.status(200).json(foundBlog);
        }
        else {
                return res.sendStatus(404);
        }
})
blogsRouter.delete('/:id', authorizationGuardMiddleware, (req, res) => {
        const deletedBlog = blogsRepository.deleteBlogByTd(Number(req.params.id));
        if(deletedBlog) {
                return res.sendStatus(204);
        }
        else {
                return res.sendStatus(404);
        }
})
blogsRouter.post('/', authorizationGuardMiddleware, nameBlogValidation,
    descriptionBlogValidation, websiteUrlBlogValidation, errorsValidation,
    (req: Request, res: Response) => {
        const createdBlog = blogsRepository.createBlog(String(req.body.name), String(req.body.description), String(req.body.websiteUrl));
        return res.status(201).json(createdBlog)
})
blogsRouter.put('/:id', authorizationGuardMiddleware, nameBlogValidation,
    descriptionBlogValidation, websiteUrlBlogValidation, errorsValidation,
    (req: Request, res: Response) => {
            const updatedBlog = blogsRepository.updateBlog(Number(req.params.id), String(req.body.name),
                String(req.body.description), String(req.body.websiteUrl));
            if(updatedBlog) {
                    return res.sendStatus(204);
            }
            else {
                    return res.sendStatus(404);
            }
    })