import mongoose from "mongoose";
import {UsersCollectionType} from "../../types/collection-types/users-collection-type";
import {CommentsCollectionType} from "../../types/collection-types/comments-collection-type";
import {RefreshTokensMetaType} from "../../types/collection-types/refresh-tokens-meta-type";
import {ReactionsCollectionType} from "../../types/collection-types/reactions-collection-type";

export const userSchema = new mongoose.Schema<UsersCollectionType>({
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
export const commentSchema = new mongoose.Schema<CommentsCollectionType>({
    id: mongoose.Schema.Types.String,
    content: String,
    userId: String,
    userLogin: String,
    createdAt: String,
    postId: {type: mongoose.Schema.Types.String, ref: 'posts'}
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}});
commentSchema.virtual('reactions', {
    ref: 'reactions',
    localField: 'id',
    foreignField: 'entityId'
});
export const refreshTokensMetaSchema = new mongoose.Schema<RefreshTokensMetaType>({
    issuedAt: Number,
    expirationAt: Number,
    deviceId: String,
    deviceIp: String,
    deviceName: String,
    userId: String
});

export const reactionSchema = new mongoose.Schema<ReactionsCollectionType>({
    id: String,
    entityId: mongoose.Schema.Types.String,//{ type: Schema.Types.String, ref: 'comments' },
    userId: String,
    login: String,
    reaction: {type: String, enum: ["Like", "Dislike"]},
    createdAt: Date
});