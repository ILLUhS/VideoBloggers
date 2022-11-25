import express from 'express'  //import express, {Request, Response, Router}
import {blogsRouter} from "./routes/blogs-router";
import {testingAllDataRouter} from "./routes/testing-all-data-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./repositories/db";

export const app = express(); //вынести в отдельный файл (config app), из index.ts ничего не должно экспортироваься, только импорт
const port = process.env.PORT || 3000;
const jsonBody = express.json();
app.use(jsonBody);
app.use('/testing/all-data', testingAllDataRouter)
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);
const startApp = async () => {
    await runDb();
    app.listen(port, () => {
        console.log(`app listening on port ${port}`)
    });
}
startApp();
