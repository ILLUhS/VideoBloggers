import {CommentCreateType} from "../types/create-model-types/comment-create-type";
import {CommentUpdateType} from "../types/update-model-types/comment-update-type";
import {CommentModel} from "./db";

export const commentsRepository = {
    async create(newComment: CommentCreateType) {
        try {
            await CommentModel.create(newComment);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    },
    async deleteAll(): Promise<boolean> {
        return (await CommentModel.deleteMany().exec()).acknowledged;
    },
    async deleteByTd(id: string): Promise<boolean> {
        return (await CommentModel.deleteOne({id: id}).exec()).deletedCount === 1;
    },
    async update(updateComment: CommentUpdateType): Promise<boolean> {
        return (await CommentModel.updateOne({id: updateComment.id},
            {content: updateComment.content}).exec()).matchedCount === 1;
    }
}