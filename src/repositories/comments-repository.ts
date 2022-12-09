import {CommentCreateModel} from "../models/comment-create-model";
import {commentsCollection} from "./db";

export const commentsRepository = {
    async create(newComment: CommentCreateModel) {
        return (await commentsCollection.insertOne({...newComment})).acknowledged;
    },
    async deleteAll(): Promise<boolean> {
        return (await commentsCollection.deleteMany({})).acknowledged;
    },
    async deleteByTd(id: string): Promise<boolean> {
        return (await commentsCollection.deleteOne({id: id})).deletedCount === 1;
    }
}