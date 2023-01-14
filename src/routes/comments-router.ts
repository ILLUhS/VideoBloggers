import {Router, Request, Response} from "express";
import {authorizationBearerGuard} from "../middlewares/authorization-bearer-guard";
import {contentCommentValidation, errorsValidation, likeStatusValidation} from "../middlewares/input-validation";
import {checkAuthorizationHeaders} from "../middlewares/check-authorization-headers";
import {commentsService, likeService, queryRepository} from "../composition-root";

export const commentsRouter = Router({})

commentsRouter.get('/:id', checkAuthorizationHeaders, async (req: Request, res: Response) => {
    let foundComment;
    if(req.user)
        foundComment = await queryRepository.findCommentById(String(req.params.id), req.user.id);
    else
        foundComment = await queryRepository.findCommentById(String(req.params.id));
    if(foundComment)
        return res.status(200).json(foundComment);
    else
        return res.sendStatus(404);
});
commentsRouter.delete('/:id', authorizationBearerGuard, async (req: Request, res: Response) => {
    const foundComment = await queryRepository.findCommentById(String(req.params.id));
    if(!foundComment)
        return res.sendStatus(404);
    if(foundComment.userId === req.user!.id) {
        await commentsService.deleteCommentByTd(String(req.params.id));
        return res.sendStatus(204);
    }
    else
        return res.sendStatus(403);
});
commentsRouter.put('/:id', authorizationBearerGuard, contentCommentValidation,
    errorsValidation, async (req: Request, res: Response) => {
    const foundComment = await queryRepository.findCommentById(String(req.params.id));
    if(!foundComment)
        return res.sendStatus(404);
    if(foundComment.userId === req.user!.id) {
        await commentsService.updateComment(String(req.params.id), String(req.body.content));
        return res.sendStatus(204);
    }
    else
        return res.sendStatus(403);
});
commentsRouter.put('/:id/like-status', authorizationBearerGuard, likeStatusValidation,
    errorsValidation, async (req: Request, res: Response) => {
    const foundComment = await queryRepository.findCommentById(String(req.params.id));
    if (!foundComment)
        return res.sendStatus(404);
    await likeService.setLikeDislike(String(req.body.likeStatus), String(req.params.id), req.user!.id);
    return res.sendStatus(204);
});