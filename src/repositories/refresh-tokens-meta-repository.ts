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
    async update(issuedAt: number, expirationAt: number, deviceId: string,
                 deviceIp: string, userId: string): Promise<boolean> {
        return (await refreshTokensMetaCollection.updateOne({deviceId: deviceId, userId: userId},
            { $set:
                    {
                        issuedAt: issuedAt,
                        expirationAt: expirationAt,
                        deviceIp: deviceIp
                    }
            })).matchedCount === 1;
    },
    async deleteByUserIdAndDeviceId(userId: string, deviceId: string): Promise<boolean> {
        return (await refreshTokensMetaCollection.deleteOne({
            userId: userId,
            deviceId: deviceId
        })).deletedCount === 1;
    },
    async deleteById(userId: string): Promise<boolean> {
        return (await refreshTokensMetaCollection.deleteMany({userId: userId})).acknowledged;
    },
    async deleteAll(): Promise<boolean> {
        return (await refreshTokensMetaCollection.deleteMany({})).acknowledged;
    },
    async findByUserId(userId: string) {
        return await refreshTokensMetaCollection.find({userId: userId},
            {projection: {_id: 0}}).toArray();
    },
    async deleteAllExceptCurrent(userId: string, deviceId: string): Promise<boolean> {
        return (await refreshTokensMetaCollection.deleteMany({userId: userId,
            deviceId: { $ne: deviceId}})).acknowledged;
    },
    async deleteByDeviceId(deviceId: string): Promise<boolean> {
        return (await refreshTokensMetaCollection.deleteOne({deviceId: deviceId})).deletedCount === 1;
    }
}