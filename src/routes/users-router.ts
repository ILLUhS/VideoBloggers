import {Request, Response, Router} from "express";
import {authorizationBasicGuardMiddleware} from "../middlewares/authorization-basic-guard-middleware";
import {queryRepository} from "../repositories/query-repository";
import {
    emailValidation,
    errorsValidation,
    loginValidation,
    passwordValidation, queryParamsValidation
} from "../middlewares/input-validation-middleware";
import {usersService} from "../services/users-service";

export const usersRouter = Router({});
usersRouter.get('/', authorizationBasicGuardMiddleware, queryParamsValidation,
    async (req: Request, res: Response) => {
    return res.status(200).json(await queryRepository.getUsersWithQueryParam(req.searchParams!));
});
usersRouter.post('/', authorizationBasicGuardMiddleware, loginValidation,
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
usersRouter.delete('/:id', authorizationBasicGuardMiddleware, async (req: Request, res: Response) => {
    const deletedUser = await usersService.deleteUserById(String(req.params.id));
    if(deletedUser)
        return res.sendStatus(204);
    else
        return res.sendStatus(404);
});