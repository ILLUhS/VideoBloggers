import {MongoClient, ObjectId} from "mongodb";
import * as dotenv from 'dotenv'
dotenv.config();
export type BlogsType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
};
export type PostsType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};
const mongoURI = process.env.mongoURL //"mongodb://127.0.0.1:27017"
if(!mongoURI) {
    throw Error('Bad URL')
}
const client = new MongoClient(mongoURI);

const db = client.db();

export const blogsCollection = db.collection<BlogsType>("blogs");
export const postsCollection = db.collection<PostsType>("posts");

export async function runDb() {
    try {
        await client.connect();
    } catch {
        await client.close();
    }
}