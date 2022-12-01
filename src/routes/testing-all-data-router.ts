import {Router} from "express";
import {blogsService} from "../services/blogs-service";
import {postsService} from "../services/posts-service";

export const testingAllDataRouter = Router({});

testingAllDataRouter.delete('/', async (req, res) => {
    await blogsService.allBlogsDelete();
    await postsService.allPostsDelete()
    return res.sendStatus(204);
})