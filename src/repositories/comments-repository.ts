import {CommentCreateModel} from "../models/comment-create-model";
import {commentsCollection} from "./db";

export const commentsRepository = {
    async create(newComment: CommentCreateModel) {
        return (await commentsCollection.insertOne({...newComment})).acknowledged;
    }
}