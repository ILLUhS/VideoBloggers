import { v4 as uuidv4 } from 'uuid'
import {CommentsRepository} from "../repositories/comments-repository";
import {inject, injectable} from "inversify";

@injectable()
export class CommentsService {
    constructor(@inject(CommentsRepository) protected commentsRepository: CommentsRepository) { };
    async createComment(content: string, userId: string, userLogin: string, postId: string) {
        const newComment = {
            id: uuidv4(),
            content: content,
            userId: userId,
            userLogin: userLogin,
            createdAt: new Date().toISOString(),
            postId: postId
        };
        const result = await this.commentsRepository.create(newComment);
        return result ? newComment.id : null;
    };
    async deleteAllComments() {
        return await  this.commentsRepository.deleteAll();
    };
    async deleteCommentByTd(id: string) {
        return await this.commentsRepository.deleteByTd(id);
    };
    async updateComment(id: string, content: string) {
        const updateComment = {
            id: id,
            content: content
        }
        return await this.commentsRepository.update(updateComment);
    };
}