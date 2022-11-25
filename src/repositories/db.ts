import {MongoClient, ObjectId} from "mongodb";

export type BlogsType = {
    _id?: ObjectId;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
};
export type PostsType = {
    _id?: ObjectId;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
};
const mongoURI = process.env.mongoURI || "mongodb+srv://illuhs:55FALKyiHyOE0NdL@cluster0.bht0jnx.mongodb.net/video-bloggers?retryWrites=true&w=majority" //"mongodb://127.0.0.1:27017"

const client = new MongoClient(mongoURI);

const db = client.db("video-bloggers");

export const blogsCollection = db.collection<BlogsType>("blogs");
export const postsCollection = db.collection<PostsType>("posts");

export async function runDb() {
    try {
        await client.connect();
        await client.db("video-bloggers").command({ping: 1});
    } catch {
        await client.close();
    }
}