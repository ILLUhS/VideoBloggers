import {refreshTokenCollection} from "./db";

export const refreshTokenRepository = {
    async find(id: string): Promise<boolean> {
        const result = await refreshTokenCollection.findOne({id: id}, {projection: {_id: 0}});
        return !!result;  //!! - конвертирует переменную в логическое значение

    },
    async create(id: string, token: string): Promise<boolean> {
        return (await refreshTokenCollection.insertOne({id: id, token: token})).acknowledged;
    }
}