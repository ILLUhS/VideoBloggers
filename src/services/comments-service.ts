import { v4 as uuidv4 } from 'uuid'
import {commentsRepository} from "../repositories/comments-repository";
export const commentsService = {
    async createComment(content: string, userId: string, userLogin: string) {
        const newComment = {
            id: uuidv4(),
            content: content,
            userId: userId,
            userLogin: userLogin,
            createdAt: new Date().toISOString()
        };
        const result = await commentsRepository.create(newComment);
        return result ? newComment.id : null;
    }
}