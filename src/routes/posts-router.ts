import {Request, Response, Router} from "express";
import {authorizationBasicGuard} from "../middlewares/authorization-basic-guard";
import {
    blogIdPostValidation, contentCommentValidation,
    contentPostValidation, errorsValidation, likeStatusValidation, postIdIsExist, queryParamsValidation,
    shortDescriptionPostValidation, titlePostValidation
} from "../middlewares/input-validation";
import {queryRepository} from "../repositories/query-repository";
import {postsService} from "../services/posts-service";
import {authorizationBearerGuard} from "../middlewares/authorization-bearer-guard";
import {checkAuthorizationHeaders} from "../middlewares/check-authorization-headers";
import {likeService} from "../services/like-service";

export const postsRouter = Router({});

postsRouter.get('/', checkAuthorizationHeaders, queryParamsValidation, async (req, res) => {
    let foundPosts;
    if(req.user)
        foundPosts = await queryRepository.getPotsWithQueryParam(req.searchParams!, {}, req.user.id);
    else
        foundPosts = await queryRepository.getPotsWithQueryParam(req.searchParams!);
    if(foundPosts)
        return res.status(200).json(foundPosts);
    else
        return res.sendStatus(404);
});
postsRouter.get('/:id', checkAuthorizationHeaders, async (req, res) => {
    let foundPost;
    if(req.user)
        foundPost = await queryRepository.findPostById(String(req.params.id), req.user.id);
    else
        foundPost = await queryRepository.findPostById(String(req.params.id));
    if(foundPost)
        return res.status(200).json(foundPost);
    else
        return res.sendStatus(404);
});
postsRouter.delete('/:id', authorizationBasicGuard, async (req, res) => {
    const deletedPost = await postsService.deletePostByTd(String(req.params.id));
    if(deletedPost)
        return res.sendStatus(204);
    else
        return res.sendStatus(404);
});
postsRouter.post('/', authorizationBasicGuard, titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, blogIdPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const createdPostId = await postsService.createPost(String(req.body.title), String(req.body.shortDescription),
            String(req.body.content), String(req.body.blogId));
        if(createdPostId)
            return res.status(201).json(await queryRepository.findPostById(createdPostId))
        else
            return res.status(409).send('Database write error');
});
postsRouter.put('/:id', authorizationBasicGuard, titlePostValidation, shortDescriptionPostValidation,
    contentPostValidation, blogIdPostValidation, errorsValidation,
    async (req: Request, res: Response) => {
        const updatedPost = await postsService.updatePost(String(req.params.id), String(req.body.title),
            String(req.body.shortDescription), String(req.body.content), String(req.body.blogId));
        if(updatedPost)
            return res.sendStatus(204);
        else
            return res.sendStatus(404);
});
postsRouter.post('/:id/comments', authorizationBearerGuard, postIdIsExist,
    contentCommentValidation, errorsValidation, async (req: Request, res: Response) => {
        const createdCommentId = await postsService.createCommentByPostId(String(req.body.content),
            req.user!.id, req.user!.login, req.params.id);
        if(createdCommentId)
            return res.status(201).json(await queryRepository.findCommentById(createdCommentId));
        else
            return res.status(409).send('Database write error');
});
postsRouter.get('/:id/comments', postIdIsExist, queryParamsValidation, checkAuthorizationHeaders,
    async (req: Request, res: Response) => {
        let foundComments;
        if(req.user)
            foundComments = await queryRepository.getCommentsWithQueryParam(req.searchParams!,
                {postId: String(req.params.id)}, req.user.id);
        else
            foundComments = await queryRepository.getCommentsWithQueryParam(req.searchParams!,
                {postId: String(req.params.id)});
    return res.status(200).json(foundComments);
});
postsRouter.put('/:id/like-status', authorizationBearerGuard, likeStatusValidation,
    errorsValidation, async (req: Request, res: Response) => {
        const foundPost = await queryRepository.findPostById(String(req.params.id));
        if (!foundPost)
            return res.sendStatus(404);
        await likeService.setLikeDislike(String(req.body.likeStatus), String(req.params.id), req.user!.id);
        return res.sendStatus(204);
    });