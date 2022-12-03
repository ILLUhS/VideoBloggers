import {Router} from "express";
import {blogsService} from "../services/blogs-service";
import {postsService} from "../services/posts-service";
import {usersService} from "../services/users-service";

export const testingAllDataRouter = Router({});

testingAllDataRouter.delete('/', async (req, res) => {
    const blogsIsDeleted = await blogsService.deleteAllBlogs();
    const postsIsDeleted = await postsService.deleteAllPosts();
    const usersIsDeleted = await usersService.deleteAllUsers();
    if(blogsIsDeleted && postsIsDeleted && usersIsDeleted)
        return res.sendStatus(204);
    else
        return res.status(409).send('Database error');
})