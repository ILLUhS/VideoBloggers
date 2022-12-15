import express from "express";
import {testingAllDataRouter} from "../routes/testing-all-data-router";
import {blogsRouter} from "../routes/blogs-router";
import {postsRouter} from "../routes/posts-router";
import {usersRouter} from "../routes/users-router";
import {authRouter} from "../routes/auth-router";
import {commentsRouter} from "../routes/comments-router";
import {runDb} from "../repositories/db";
import {settings} from "./settings";
import cookieParser from "cookie-parser";
export const app = express();

const jsonBody = express.json();

app.use(jsonBody);
app.use(cookieParser());
app.use('/testing/all-data', testingAllDataRouter)
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/comments', commentsRouter);

const port = settings.PORT;

export const startApp = async (): Promise<void> => {
    await runDb();
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    });
}