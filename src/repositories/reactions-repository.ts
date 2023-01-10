import {ReactionModel} from "./db";

export const reactionsRepository = {
    async create(id: string, status: string, commentId: string, userId: string) {
        try {
            await ReactionModel.create(
                {
                    id: id,
                    commentId: commentId,
                    userId: userId,
                    reaction: status
                }
            );
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    },
    async update(status: string, commentId: string, userId: string) {
        return (await ReactionModel.updateOne({commentId: commentId, userId: userId},
            {reaction: status}).exec()).matchedCount === 1;
    },
    async find(commentId: string, userId: string) {
        return await ReactionModel.findOne({commentId: commentId, userId: userId}).select({_id: 0, __v: 0}).exec();
    },
    async delete(commentId: string, userId: string) {
        return (await ReactionModel.deleteOne({commentId: commentId, userId: userId}).exec()).deletedCount === 1;
    }
}