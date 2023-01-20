import { v4 as uuidv4 } from 'uuid';
import {ReactionsCollectionType} from "../types/collection-types/reactions-collection-type";
import {usersService} from "../dependencies/composition-root";
import {ReactionsRepository} from "../repositories/reactions-repository";
import {inject, injectable} from "inversify";

@injectable()
export class LikeService {
    constructor(@inject(ReactionsRepository) protected reactionsRepository: ReactionsRepository) { };
    async setLikeDislike(status: string, entityId: string, userId: string) { //entityId - id документа, которому принадлежит лайк (commentId or postId)
        const result = await this.checkLike(entityId, userId);
        if(result) {
            if(status === 'None')
                return await this.reactionsRepository.delete(entityId, userId);
            else if (result === status)
                return true;
            else {
                return await this.reactionsRepository.update(status, entityId, userId);
            }
        }
        if(status === 'None')
            return true;
        const user = await usersService.findUser('id', userId);
        if(!user)
            throw Error('user not found');
        const newLike: ReactionsCollectionType = {
            id : uuidv4(),
            entityId: entityId,
            userId: userId,
            login: user.login,
            reaction: status,
            createdAt: new Date()
        };
        return await this.reactionsRepository.create(newLike);
    };
    async checkLike(entityId: string, userId: string): Promise<string | null> {
        const foundLike = await this.reactionsRepository.find(entityId, userId);
        if(!foundLike)
            return null;
        return foundLike.reaction;
    };
    async deleteAllLikes() {
        return await this.reactionsRepository.deleteAll();
    }
}