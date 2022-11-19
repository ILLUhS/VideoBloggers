import {Router} from "express";
import {authorizationGuardMiddleware} from "../middlewares/authorization-guard-middleware";
import {blogsRepository} from "../repositories/blogs-repository";

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