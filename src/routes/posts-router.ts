import {Request, Response, Router} from "express";
import {authorizationGuardMiddleware} from "../middlewares/authorization-guard-middleware";
import {postsRepository} from "../repositories/posts-repository";
import {
    blogIdPostValidation,
    contentPostValidation, errorsValidation, queryParamsValidation,
    shortDescriptionPostValidation, titlePostValidation
} from "../middlewares/input-validation-middleware";
import {queryRepository} from "../repositories/query-repository";


export const postsRouter = Router({});

postsRouter.get('/', async (req, res) => {
    const searchParams = queryParamsValidation(req.query);
    return res.status(200).json(await queryRepository.getPotsWithQueryParam(searchParams));
})
postsRouter.get('/:id', async (req, res) => {
    const foundPost = await queryRepository.findPostById(String(req.params.id));
    if(foundPost) {
        return res.status(200).json(foundPost);
    }
    else {
        return res.sendStatus(404);
    }
})
postsRouter.delete('/:id', authorizationGuardMiddleware, async (req, res) => {
    const deletedPost = await postsRepository.deletePostByTd(String(req.params.id));
    if(deletedPost) {
        return res.sendStatus(204);
    }
    else {
        return res.sendStatus(404);
    }
})
postsRouter.post('/', authorizationGuardMiddleware, titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, blogIdPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const createdPost = await postsRepository.createPost(String(req.body.title), String(req.body.shortDescription),
            String(req.body.content), String(req.body.blogId));
        return res.status(201).json(createdPost)
    })
postsRouter.put('/:id', authorizationGuardMiddleware, titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, blogIdPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const updatedPost = await postsRepository.updatePost(String(req.params.id), String(req.body.title),
            String(req.body.shortDescription), String(req.body.content), String(req.body.blogId));
        if(updatedPost) {
            return res.sendStatus(204);
        }
        else {
            return res.sendStatus(404);
        }
    })