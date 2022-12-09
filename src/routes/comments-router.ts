import {Router, Request, Response} from "express";
import {queryRepository} from "../repositories/query-repository";
import {commentsService} from "../services/comments-service";
import {authorizationBearerGuardMiddleware} from "../middlewares/authorization-bearer-guard-middleware";

export const commentsRouter = Router({})

commentsRouter.get('/:id', async (req: Request, res: Response) => {
    const foundComment = await queryRepository.findCommentById(String(req.params.id));
    if(foundComment)
        return res.status(200).json(foundComment);
    else
        return res.sendStatus(404);
});
commentsRouter.delete('/:id', authorizationBearerGuardMiddleware, async (req: Request, res: Response) => {
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