import {Request, Response, Router} from "express";
import {authorizationBasicGuard} from "../middlewares/authorization-basic-guard";
import {queryRepository} from "../repositories/query-repository";
import {
    emailValidation,
    errorsValidation,
    loginValidation,
    passwordValidation, queryParamsValidation
} from "../middlewares/input-validation";
import {usersService} from "../services/users-service";

export const usersRouter = Router({});
usersRouter.get('/', authorizationBasicGuard, queryParamsValidation,
    async (req: Request, res: Response) => {
    return res.status(200).json(await queryRepository.getUsersWithQueryParam(req.searchParams!));
});
usersRouter.post('/', authorizationBasicGuard, loginValidation,
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
usersRouter.delete('/:id', authorizationBasicGuard, async (req: Request, res: Response) => {
    const deletedUser = await usersService.deleteUserById(String(req.params.id));
    if(deletedUser)
        return res.sendStatus(204);
    else
        return res.sendStatus(404);
});