import express from "express";
import {testingAllDataRouter} from "../routes/testing-all-data-router";
import {blogsRouter} from "../routes/blogs-router";
import {postsRouter} from "../routes/posts-router";
import {usersRouter} from "../routes/users-router";
import {authRouter} from "../routes/auth-router";
import {commentsRouter} from "../routes/comments-router";
import {settingsEnv} from "./settings-env";
import cookieParser from "cookie-parser";
import {securityDevicesRouter} from "../routes/security-devices-router";

export const app = express();

const jsonBody = express.json();

app.set('trust proxy', true)
app.use(jsonBody);
app.use(cookieParser());
app.use('/testing/all-data', testingAllDataRouter)
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/comments', commentsRouter);
app.use('/security/devices', securityDevicesRouter);

export const port = settingsEnv.PORT;

/*export const startApp = async (): Promise<void> => {
    await db.runDb();
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    });
}*/
