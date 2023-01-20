import {DataBase} from "./dataBase";
import {ReactionsCollectionType} from "../types/collection-types/reactions-collection-type";
import {inject, injectable} from "inversify";

@injectable()
export class ReactionsRepository {
    constructor(@inject(DataBase) protected db: DataBase) { };
    async create(newLike: ReactionsCollectionType) {
        try {
            await this.db.ReactionModel.create(newLike);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    };
    async update(status: string, entityId: string, userId: string) {
        return (await this.db.ReactionModel.updateOne({entityId: entityId, userId: userId},
            {reaction: status}).exec()).matchedCount === 1;
    };
    async find(entityId: string, userId: string) {
        return await this.db.ReactionModel.findOne({entityId: entityId, userId: userId}).select({_id: 0, __v: 0}).exec();
    };
    async delete(entityId: string, userId: string) {
        return (await this.db.ReactionModel.deleteOne({entityId: entityId, userId: userId}).exec()).deletedCount === 1;
    };
    async deleteAll() {
        return(await this.db.ReactionModel.deleteMany().exec()).acknowledged;
    }
}