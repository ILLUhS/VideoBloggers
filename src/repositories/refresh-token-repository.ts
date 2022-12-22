import {refreshTokensMetaCollection} from "./db";

export const refreshTokenRepository = {
    async find(token: string): Promise<boolean> {
        const result = await refreshTokensMetaCollection.findOne({token: token}, {projection: {_id: 0}});
        return !!result;  //!! - конвертирует переменную в логическое значение

    },
    async create(issueAt: number, expirationAt: number, deviceId: string, deviceIp: string, deviceName: string, userId: string): Promise<boolean> {
        return (await refreshTokensMetaCollection.insertOne({
            issueAt: issueAt,
            expirationAt: expirationAt,
            deviceId: deviceId,
            deviceIp: deviceIp,
            deviceName: deviceName,
            userId: userId
        })).acknowledged;
    },
    async deleteAll(): Promise<boolean> {
        return (await refreshTokensMetaCollection.deleteMany({})).acknowledged;
    }
}