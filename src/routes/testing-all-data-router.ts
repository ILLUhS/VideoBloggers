import {Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {postsRepository} from "../repositories/posts-repository";

export const testingAllDataRouter = Router({});

testingAllDataRouter.delete('/', (req, res) => {
    blogsRepository.allBlogsDelete();
    postsRepository.allPostsDelete()
    return res.sendStatus(204);
})