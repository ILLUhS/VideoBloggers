import mongoose from "mongoose";
import {injectable} from "inversify";
import {
    commentSchema,
    reactionSchema,
    refreshTokensMetaSchema,
    userSchema
} from "../domain/mongoose-schemas/schemas";
import {postSchema} from "../domain/mongoose-schemas/post-schema";

@injectable()
export class DataBase {
    public CommentModel = mongoose.model("comments", commentSchema);
    public UserModel = mongoose.model("users", userSchema);
    public RefreshTokensMetaModel = mongoose.model("refreshtokensmetas", refreshTokensMetaSchema);
    public PostModel = mongoose.model("posts", postSchema);
    public ReactionModel = mongoose.model("reactions", reactionSchema);

    async runDb(mongoURI: string) {
        if (!mongoURI)
            throw Error('Bad URL');
        try {
            await mongoose.connect(mongoURI);
        } catch {
            await mongoose.connection.close();
        }
    };
    async stopDb() {
        await mongoose.connection.close();
    };
}