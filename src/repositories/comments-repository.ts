import {CommentCreateModel} from "../types/models/comment-create-model";
import {CommentUpdateModel} from "../types/models/comment-update-model";
import {CommentsModel} from "./db";

export const commentsRepository = {
    async create(newComment: CommentCreateModel) {
        try {
            await CommentsModel.create(newComment);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    },
    async deleteAll(): Promise<boolean> {
        return (await CommentsModel.deleteMany().exec()).acknowledged;
    },
    async deleteByTd(id: string): Promise<boolean> {
        return (await CommentsModel.deleteOne({id: id}).exec()).deletedCount === 1;
    },
    async update(updateComment: CommentUpdateModel): Promise<boolean> {
        return (await CommentsModel.updateOne({id: updateComment.id},
            {content: updateComment.content}).exec()).matchedCount === 1;
    }
}