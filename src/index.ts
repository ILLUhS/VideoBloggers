import express, {NextFunction, Request, Response} from 'express'  //import express, {Request, Response, Router}
import {blogsRouter} from "./routes/blogs-router";

export const app = express();
const port = process.env.PORT || 3000;
const jsonBody = express.json();
app.use(jsonBody);

app.use('/blogs', blogsRouter);