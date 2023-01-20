import mongoose from "mongoose";
import {inject, injectable} from "inversify";
import {
    blogSchema,
    commentSchema,
    postSchema,
    reactionSchema,
    refreshTokensMetaSchema,
    userSchema
} from "../mongoose-schemas/schemas";

@injectable()
export class DataBase {

    public CommentModel = mongoose.model("comments", commentSchema);
    public UserModel = mongoose.model("users", userSchema);
    public RefreshTokensMetaModel = mongoose.model("refreshtokensmetas", refreshTokensMetaSchema);
    public BlogModel = mongoose.model("blogs", blogSchema);
    public PostModel = mongoose.model("posts", postSchema);
    public ReactionModel = mongoose.model("reactions", reactionSchema);

    constructor(@inject("mongoURI") protected mongoURI: string) { };

    async runDb(mongoURITest?: string) {
        if(mongoURITest)
            this.mongoURI = mongoURITest;
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