import {Request, Response, Router} from "express";
import {authorizationGuardMiddleware} from "../middlewares/authorization-guard-middleware";
import {
    blogIdPostValidation,
    contentPostValidation, errorsValidation,
    shortDescriptionPostValidation, titlePostValidation
} from "../middlewares/input-validation-middleware";
import {queryRepository} from "../repositories/query-repository";
import {postsService} from "../services/posts-service";


export const postsRouter = Router({});

postsRouter.get('/', async (req, res) => {
    return res.status(200).json(await queryRepository.getPotsWithQueryParam(req.query));
});
postsRouter.get('/:id', async (req, res) => {
    const foundPost = await queryRepository.findPostById(String(req.params.id));
    if(foundPost)
        return res.status(200).json(foundPost);
    else
        return res.sendStatus(404);
});
postsRouter.delete('/:id', authorizationGuardMiddleware, async (req, res) => {
    const deletedPost = await postsService.deletePostByTd(String(req.params.id));
    if(deletedPost)
        return res.sendStatus(204);
    else
        return res.sendStatus(404);
});
postsRouter.post('/', authorizationGuardMiddleware, titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, blogIdPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const createdPostId = await postsService.createPost(String(req.body.title), String(req.body.shortDescription),
            String(req.body.content), String(req.body.blogId));
        if(createdPostId && createdPostId.length > 0)
            return res.status(201).json(await queryRepository.findPostById(createdPostId))
        else if(createdPostId && createdPostId.length === 0)
            return res.status(409).send('Database write error');
        else
            return res.status(404).send('If specified blog doesn\'t exists');
});
postsRouter.put('/:id', authorizationGuardMiddleware, titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, blogIdPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const updatedPost = await postsService.updatePost(String(req.params.id), String(req.body.title),
            String(req.body.shortDescription), String(req.body.content), String(req.body.blogId));
        if(updatedPost)
            return res.sendStatus(204);
        else
            return res.sendStatus(404);
});