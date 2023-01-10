import {BlogsCollectionType} from "../types/collection-types/blogs-collection-type";
import {PostsCollectionType} from "../types/collection-types/posts-collection-type";
import {UsersCollectionType} from "../types/collection-types/users-collection-type";
import {settings} from "../config/settings";
import {CommentsCollectionType} from "../types/collection-types/comments-collection-type";
import {RefreshTokensMetaType} from "../types/collection-types/refresh-tokens-meta-type";
import mongoose from "mongoose";
import {ReactionsCollectionType} from "../types/collection-types/reactions-collection-type";

const mongoURI = settings.MONGO_URL
if(!mongoURI) {
    throw Error('Bad URL')
}
const { Schema } = mongoose;

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
const commentSchema = new mongoose.Schema<CommentsCollectionType>({
    id: Schema.Types.String,
    content: String,
    userId: String,
    userLogin: String,
    createdAt: String,
    postId: { type: Schema.Types.String, ref: 'posts' }
}, {toJSON: { virtuals: true }, toObject: { virtuals: true }});
commentSchema.virtual('reactions', {
    ref: 'reactions',
    localField: 'id',
    foreignField: 'commentId'
});
const refreshTokensMetaSchema = new mongoose.Schema<RefreshTokensMetaType>({
    issuedAt: Number,
    expirationAt: Number,
    deviceId: String,
    deviceIp: String,
    deviceName: String,
    userId: String
});
const blogSchema = new mongoose.Schema<BlogsCollectionType>({
    id: String,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String
});
const postSchema = new mongoose.Schema<PostsCollectionType>({
    id: Schema.Types.String,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
}, {toJSON: { virtuals: true }, toObject: { virtuals: true }});
postSchema.virtual('comments', {
    ref: 'comments',
    localField: 'id',
    foreignField: 'postId'
});
const reactionSchema = new mongoose.Schema<ReactionsCollectionType>({
    id: String,
    commentId: { type: Schema.Types.String, ref: 'comments' },
    userId: String,
    reaction: {type: String, enum: ["None", "Like", "Dislike"]}
})

export const CommentModel = mongoose.model("comments", commentSchema);
export const UserModel = mongoose.model("users", userSchema);
export const RefreshTokensMetaModel = mongoose.model("refreshtokensmetas", refreshTokensMetaSchema);
export const BlogModel = mongoose.model("blogs", blogSchema);
export const PostModel = mongoose.model("posts", postSchema);
export const ReactionModel = mongoose.model("reactions", reactionSchema);

export async function runDb() {
    try {
        await mongoose.connect(mongoURI);
    } catch {
        await mongoose.connection.close();
    }
}
export async function stopDb() {
    await mongoose.connection.close();
}