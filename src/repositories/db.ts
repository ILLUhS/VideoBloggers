import {MongoClient} from "mongodb";
import * as dotenv from 'dotenv'
import {BlogsCollectionModel} from "../models/blogs-collection-model";
import {PostsCollectionType} from "../models/posts-collection-type";
dotenv.config();
export type BlogsType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
};
const mongoURI = process.env.mongoURL //"mongodb://127.0.0.1:27017"
if(!mongoURI) {
    throw Error('Bad URL')
}
const client = new MongoClient(mongoURI);

const db = client.db();

export const blogsCollection = db.collection<BlogsCollectionModel>("blogs");
export const postsCollection = db.collection<PostsCollectionType>("posts");

export async function runDb() {
    try {
        await client.connect();
    } catch {
        await client.close();
    }
}