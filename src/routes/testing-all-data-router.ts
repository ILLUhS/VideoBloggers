import {Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";

export const testingAllDataRouter = Router({});

testingAllDataRouter.delete('/', async (req, res) => {
    await blogsRepository.allBlogsDelete();
    await postsRepository.allPostsDelete()
    return res.sendStatus(204);
})