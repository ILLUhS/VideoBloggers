import {MongoClient} from "mongodb";
import {BlogsCollectionModel} from "../types/models/blogs-collection-model";
import {PostsCollectionModel} from "../types/models/posts-collection-model";
import {UsersCollectionModel} from "../types/models/users-collection-model";
import {settings} from "../config/settings";
import {CommentsCollectionModel} from "../types/models/comments-collection-model";
import {RefreshTokenModel} from "../types/models/refresh-token-model";
const mongoURI = settings.MONGO_URL
if(!mongoURI) {
    throw Error('Bad URL')
}
const client = new MongoClient(mongoURI);

const db = client.db();

export const blogsCollection = db.collection<BlogsCollectionModel>("blogs");
export const postsCollection = db.collection<PostsCollectionModel>("posts");
export const usersCollection = db.collection<UsersCollectionModel>("users");
export const commentsCollection = db.collection<CommentsCollectionModel>("comments");
export const refreshTokenCollection = db.collection<RefreshTokenModel>("refreshToken");
export async function runDb() {
    try {
        await client.connect();
    } catch {
        await client.close();
    }
}