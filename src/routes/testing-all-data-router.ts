import {Router} from "express";
import {blogsService, commentsService, jwtService, postsService, usersService} from "../composition-root";

export const testingAllDataRouter = Router({});

testingAllDataRouter.delete('/', async (req, res) => {
    const blogsIsDeleted = await blogsService.deleteAllBlogs();
    const postsIsDeleted = await postsService.deleteAllPosts();
    const usersIsDeleted = await usersService.deleteAllUsers();
    const commentsIsDeleted = await commentsService.deleteAllComments();
    const refreshTokensMetaIsDeleted = await jwtService.deleteAllTokensMeta();
    if(blogsIsDeleted && postsIsDeleted && usersIsDeleted && commentsIsDeleted && refreshTokensMetaIsDeleted)
        return res.sendStatus(204);
    else
        return res.status(409).send('Database error');
})