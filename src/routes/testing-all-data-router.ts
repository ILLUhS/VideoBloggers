import {Router} from "express";
import {blogsService} from "../services/blogs-service";
import {postsService} from "../services/posts-service";
import {usersRepository} from "../repositories/users-repository";

export const testingAllDataRouter = Router({});

testingAllDataRouter.delete('/', async (req, res) => {
    const blogsIsDeleted = await blogsService.deleteAllBlogs();
    const postsIsDeleted = await postsService.deleteAllPosts();
    const usersIsDeleted = await usersRepository.deleteAllUsers();
    if(blogsIsDeleted && postsIsDeleted && usersIsDeleted)
        return res.sendStatus(204);
    else
        return res.status(409).send('Database error');
})