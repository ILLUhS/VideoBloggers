import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
import {BlogsCollectionModel} from "../models/blogs-collection-model";
import {PostsCollectionModel} from "../models/posts-collection-model";
import {UsersCollectionModel} from "../models/users-collection-model";
dotenv.config();
const mongoURI = process.env.mongoURL //"mongodb://127.0.0.1:27017"
if(!mongoURI) {
    throw Error('Bad URL')
}
const client = new MongoClient(mongoURI);

const db = client.db();

export const blogsCollection = db.collection<BlogsCollectionModel>("blogs");
export const postsCollection = db.collection<PostsCollectionModel>("posts");
export const usersCollection = db.collection<UsersCollectionModel>("users");
export async function runDb() {
    try {
        await client.connect();
    } catch {
        await client.close();
    }
}