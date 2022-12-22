import {refreshTokensMetaCollection} from "./db";

export const refreshTokensMetaRepository = {
    async find(issuedAt: number, deviceId: string, userId: string): Promise<boolean> {
        const result = await refreshTokensMetaCollection.findOne({
            userId: userId,
            issuedAt: issuedAt,
            deviceId: deviceId
        }, {projection: {_id: 0}});
        return !!result;  //!! - конвертирует переменную в логическое значение

    },
    async create(issuedAt: number, expirationAt: number, deviceId: string, deviceIp: string, deviceName: string, userId: string): Promise<boolean> {
        return (await refreshTokensMetaCollection.insertOne({
            issuedAt: issuedAt,
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