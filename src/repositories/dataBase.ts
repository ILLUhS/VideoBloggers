import {BlogsCollectionType} from "../types/collection-types/blogs-collection-type";
import {PostsCollectionType} from "../types/collection-types/posts-collection-type";
import {UsersCollectionType} from "../types/collection-types/users-collection-type";
import {CommentsCollectionType} from "../types/collection-types/comments-collection-type";
import {RefreshTokensMetaType} from "../types/collection-types/refresh-tokens-meta-type";
import {ReactionsCollectionType} from "../types/collection-types/reactions-collection-type";
import mongoose from "mongoose";

export class DataBase {
    public CommentModel;
    public UserModel;
    public RefreshTokensMetaModel;
    public BlogModel;
    public PostModel;
    public ReactionModel;

    constructor(protected mongoURI: string) {
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
            id: mongoose.Schema.Types.String,
            title: String,
            shortDescription: String,
            content: String,
            blogId: String,
            blogName: String,
            createdAt: String
        }, {toJSON: {virtuals: true}, toObject: {virtuals: true}});
        postSchema.virtual('reactions', {
            ref: 'reactions',
            localField: 'id',
            foreignField: 'entityId'
        });
        const reactionSchema = new mongoose.Schema<ReactionsCollectionType>({
            id: String,
            entityId: mongoose.Schema.Types.String,//{ type: Schema.Types.String, ref: 'comments' },
            userId: String,
            login: String,
            reaction: {type: String, enum: ["Like", "Dislike"]},
            createdAt: Date
        })

        this.CommentModel = mongoose.model("comments", commentSchema);
        this.UserModel = mongoose.model("users", userSchema);
        this.RefreshTokensMetaModel = mongoose.model("refreshtokensmetas", refreshTokensMetaSchema);
        this.BlogModel = mongoose.model("blogs", blogSchema);
        this.PostModel = mongoose.model("posts", postSchema);
        this.ReactionModel = mongoose.model("reactions", reactionSchema);
    }

    async runDb() {
        if (!this.mongoURI)
            throw Error('Bad URL');
        try {
            await mongoose.connect(this.mongoURI);
        } catch {
            await mongoose.connection.close();
        }
    };
    async stopDb() {
        await mongoose.connection.close();
    };
}