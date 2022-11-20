import express from 'express'  //import express, {Request, Response, Router}
import {blogsRouter} from "./routes/blogs-router";
import {mainRouter} from "./routes/main-router";
import {postsRouter} from "./routes/posts-router";

export const app = express();
const port = process.env.PORT || 3000;
const jsonBody = express.json();
app.use(jsonBody);
app.use('/', mainRouter)
app.use('/blogs', blogsRouter);
app.use('/posts', postsRouter);

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})