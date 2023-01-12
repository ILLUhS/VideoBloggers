import {ReactionModel} from "./db";
import {ReactionsCollectionType} from "../types/collection-types/reactions-collection-type";

export const reactionsRepository = {
    async create(newLike: ReactionsCollectionType) {
        try {
            await ReactionModel.create(newLike);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    },
    async update(status: string, entityId: string, userId: string) {
        return (await ReactionModel.updateOne({entityId: entityId, userId: userId},
            {reaction: status}).exec()).matchedCount === 1;
    },
    async find(entityId: string, userId: string) {
        return await ReactionModel.findOne({entityId: entityId, userId: userId}).select({_id: 0, __v: 0}).exec();
    },
    async delete(entityId: string, userId: string) {
        return (await ReactionModel.deleteOne({entityId: entityId, userId: userId}).exec()).deletedCount === 1;
    }
}