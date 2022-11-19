import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";

export const mainRouter = Router({});

mainRouter.delete('/', (req, res) => {
    blogsRepository.allBlogsDelete();

    return res.sendStatus(204);
})