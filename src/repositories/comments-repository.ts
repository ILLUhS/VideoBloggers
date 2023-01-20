import {CommentCreateType} from "../types/create-model-types/comment-create-type";
import {CommentUpdateType} from "../types/update-model-types/comment-update-type";
import {DataBase} from "./dataBase";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsRepository {
    constructor(@inject(DataBase) protected db: DataBase) { };
    async create(newComment: CommentCreateType) {
        try {
            await this.db.CommentModel.create(newComment);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    };
    async deleteAll(): Promise<boolean> {
        return (await this.db.CommentModel.deleteMany().exec()).acknowledged;
    };
    async deleteByTd(id: string): Promise<boolean> {
        return (await this.db.CommentModel.deleteOne({id: id}).exec()).deletedCount === 1;
    };
    async update(updateComment: CommentUpdateType): Promise<boolean> {
        return (await this.db.CommentModel.updateOne({id: updateComment.id},
            {content: updateComment.content}).exec()).matchedCount === 1;
    };
}