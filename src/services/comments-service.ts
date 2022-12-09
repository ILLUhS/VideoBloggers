import { v4 as uuidv4 } from 'uuid'
import {commentsRepository} from "../repositories/comments-repository";
export const commentsService = {
    async createComment(content: string, userId: string, userLogin: string, postId: string) {
        const newComment = {
            id: uuidv4(),
            content: content,
            userId: userId,
            userLogin: userLogin,
            createdAt: new Date().toISOString(),
            postId: postId
        };
        const result = await commentsRepository.create(newComment);
        return result ? newComment.id : null;
    },
    async deleteAllComments() {
        return await  commentsRepository.deleteAll();
    },
    async deleteCommentByTd(id: string) {
        return await commentsRepository.deleteByTd(id);
    }
}