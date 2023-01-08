import {MongoClient} from "mongodb";
import {BlogsCollectionType} from "../types/collection-types/blogs-collection-type";
import {PostsCollectionType} from "../types/collection-types/posts-collection-type";
import {UsersCollectionType} from "../types/collection-types/users-collection-type";
import {settings} from "../config/settings";
import {CommentsCollectionType} from "../types/collection-types/comments-collection-type";
import {RefreshTokensMetaType} from "../types/collection-types/refresh-tokens-meta-type";
import mongoose from "mongoose";
const mongoURI = settings.MONGO_URL
if(!mongoURI) {
    throw Error('Bad URL')
}
const client = new MongoClient(mongoURI);

const db = client.db();

export const blogsCollection = db.collection<BlogsCollectionType>("blogs");
export const postsCollection = db.collection<PostsCollectionType>("posts");
export const usersCollection = db.collection<UsersCollectionType>("users");
export const commentsCollection = db.collection<CommentsCollectionType>("comments");
export const refreshTokensMetaCollection = db.collection<RefreshTokensMetaType>("refreshtokensmetas");

const userSchema = new mongoose.Schema<UsersCollectionType>({
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
const commentsSchema = new mongoose.Schema<CommentsCollectionType>({
    id: String,
    content: String,
    userId: String,
    userLogin: String,
    createdAt: String,
    postId: String
});
const refreshTokensMetaSchema = new mongoose.Schema<RefreshTokensMetaType>({
    issuedAt: Number,
    expirationAt: Number,
    deviceId: String,
    deviceIp: String,
    deviceName: String,
    userId: String
});
const blogsSchema = new mongoose.Schema<BlogsCollectionType>({
    id: String,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String
});
const postSchema = new mongoose.Schema<PostsCollectionType>({
    id: String,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
})

export const CommentsModel = mongoose.model("comments", commentsSchema);
export const UserModel = mongoose.model("users", userSchema);
export const RefreshTokensMetaModel = mongoose.model("refreshtokensmetas", refreshTokensMetaSchema);

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
