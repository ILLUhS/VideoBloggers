import {Router} from "express";
import {authorizationGuardMiddleware} from "../middlewares/authorization-guard-middleware";

export const blogsRouter = Router({});

blogsRouter.get('/', (req, res) => {

})