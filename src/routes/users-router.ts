import {Request, Response, Router} from "express";
import {authorizationGuardMiddleware} from "../middlewares/authorization-guard-middleware";
import {queryRepository} from "../repositories/query-repository";
import {
    emailValidation,
    errorsValidation,
    loginValidation,
    passwordValidation
} from "../middlewares/input-validation-middleware";
import {usersService} from "../services/users-service";

export const usersRouter = Router({});
usersRouter.get('/', authorizationGuardMiddleware, async (req: Request, res: Response) => {
    return res.status(200).json(await queryRepository.getUsersWithQueryParam(req.query));
});
usersRouter.post('/', authorizationGuardMiddleware, loginValidation,
    passwordValidation, emailValidation, errorsValidation,
    async (req: Request, res: Response) => {
    const createdUserId = await usersService.createUser(
        String(req.body.login),
        String(req.body.password),
        String(req.body.email)
    );
    if(createdUserId)
        return res.status(201).json(await queryRepository.findUserById(createdUserId));
    else
        return res.status(409).send('Database write error');
});
usersRouter.delete('/:id', authorizationGuardMiddleware, async (req: Request, res: Response) => {
    const deletedUser = await usersService.deleteUserById(String(req.params.id));
    if(deletedUser)
        return res.sendStatus(204);
    else
        return res.sendStatus(404);
});