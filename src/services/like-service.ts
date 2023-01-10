import {reactionsRepository} from "../repositories/reactions-repository";
import { v4 as uuidv4 } from 'uuid';

export const likeService = {
    async setLikeDislike(status: string, commentId: string, userId: string) {
        const result = await this.checkLike(commentId, userId);
        if(result) {
            if(status === 'None')
                return await reactionsRepository.delete(commentId, userId);
            else if (result === status)
                return true;
            else {
                return await reactionsRepository.update(status, commentId, userId);
            }
        }
        if(status === 'None')
            return true;
        const id = uuidv4();
        return await reactionsRepository.create(id, status, commentId, userId);
    },
    async checkLike(commentId: string, userId: string): Promise<string | null> {
        const foundLike = await reactionsRepository.find(commentId, userId);
        if(!foundLike)
            return null;
        return foundLike.reaction;
    }
}