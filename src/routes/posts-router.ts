import {Request, Response, Router} from "express";
import {authorizationBasicGuardMiddleware} from "../middlewares/authorization-basic-guard-middleware";
import {
    blogIdPostValidation, contentCommentValidation,
    contentPostValidation, errorsValidation, postIdIsExist, queryParamsValidation,
    shortDescriptionPostValidation, titlePostValidation
} from "../middlewares/input-validation-middleware";
import {queryRepository} from "../repositories/query-repository";
import {postsService} from "../services/posts-service";
import {authorizationBearerGuardMiddleware} from "../middlewares/authorization-bearer-guard-middleware";

export const postsRouter = Router({});

postsRouter.get('/', queryParamsValidation, async (req, res) => {
    return res.status(200).json(await queryRepository.getPotsWithQueryParam(req.searchParams!));
});
postsRouter.get('/:id', async (req, res) => {
    const foundPost = await queryRepository.findPostById(String(req.params.id));
    if(foundPost)
        return res.status(200).json(foundPost);
    else
        return res.sendStatus(404);
});
postsRouter.delete('/:id', authorizationBasicGuardMiddleware, async (req, res) => {
    const deletedPost = await postsService.deletePostByTd(String(req.params.id));
    if(deletedPost)
        return res.sendStatus(204);
    else
        return res.sendStatus(404);
});
postsRouter.post('/', authorizationBasicGuardMiddleware, titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, blogIdPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const createdPostId = await postsService.createPost(String(req.body.title), String(req.body.shortDescription),
            String(req.body.content), String(req.body.blogId));
        if(createdPostId)
            return res.status(201).json(await queryRepository.findPostById(createdPostId))
        else
            return res.status(409).send('Database write error');
});
postsRouter.put('/:id', authorizationBasicGuardMiddleware, titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, blogIdPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const updatedPost = await postsService.updatePost(String(req.params.id), String(req.body.title),
            String(req.body.shortDescription), String(req.body.content), String(req.body.blogId));
        if(updatedPost)
            return res.sendStatus(204);
        else
            return res.sendStatus(404);
});
postsRouter.post('/:id/comments', authorizationBearerGuardMiddleware, postIdIsExist,
    contentCommentValidation, errorsValidation, async (req: Request, res: Response) => {
        const createdCommentId = await postsService.createCommentByPostId(String(req.body.content),
            req.user!.id, req.user!.login, req.params.id);
        if(createdCommentId)
            return res.status(201).json(await queryRepository.findCommentById(createdCommentId));
        else
            return res.status(409).send('Database write error');
});
postsRouter.get('/:id/comments', postIdIsExist, queryParamsValidation,
    async (req: Request, res: Response) => {
    const foundComments = await queryRepository.getCommentsWithQueryParam(req.searchParams!,
        {postId: String(req.params.id)});
    return res.status(200).json(foundComments);
});