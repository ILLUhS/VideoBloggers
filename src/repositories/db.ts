import {MongoClient} from "mongodb";
import {BlogsCollectionModel} from "../types/models/blogs-collection-model";
import {PostsCollectionModel} from "../types/models/posts-collection-model";
import {UsersCollectionModel} from "../types/models/users-collection-model";
import {settings} from "../config/settings";
import {CommentsCollectionModel} from "../types/models/comments-collection-model";
import {RefreshTokensMetaModel} from "../types/models/refresh-tokens-meta-model";
import mongoose from "mongoose";
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
export const refreshTokensMetaCollection = db.collection<RefreshTokensMetaModel>("refreshTokensMeta");

const userSchema = new mongoose.Schema<UsersCollectionModel>({
    id: String,
    accountData: {
        login: String,
        passwordHash: String,
        email: String,
        createdAt: String
    },
    emailConfirmation: {
        confirmationCode: String,
        expirationTime: Date,
        isConfirmed: String
    },
    passwordRecovery: {
        type: {
            recoveryCode: String,
            expirationTime: Date,
            isUsed: Boolean
        },
        default: null
    }
});
const commentsSchema = new mongoose.Schema<CommentsCollectionModel>({
    id: String,
    content: String,
    userId: String,
    userLogin: String,
    createdAt: String,
    postId: String
});

export const CommentsModel = mongoose.model("comments", commentsSchema);
export const UserModel = mongoose.model("users", userSchema);

export async function runDb() {
    try {
        await client.connect();
        await mongoose.connect(mongoURI);
    } catch {
        await client.close();
        await mongoose.connection.close();
    }
}
export async function stopDb() {
    await client.close();
}
