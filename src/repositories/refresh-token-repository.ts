import {refreshTokenCollection} from "./db";

export const refreshTokenRepository = {
    async find(token: string): Promise<boolean> {
        const result = await refreshTokenCollection.findOne({token: token}, {projection: {_id: 0}});
        return !!result;  //!! - конвертирует переменную в логическое значение

    },
    async create(token: string): Promise<boolean> {
        return (await refreshTokenCollection.insertOne({token: token})).acknowledged;
    },
    async deleteAll(): Promise<boolean> {
        return (await refreshTokenCollection.deleteMany({})).acknowledged;
    }
}