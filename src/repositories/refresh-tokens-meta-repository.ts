import {RefreshTokensMetaModel} from "./db";

export class RefreshTokensMetaRepository {
    async find(issuedAt: number, deviceId: string, userId: string): Promise<boolean> {
        const result = await RefreshTokensMetaModel.findOne({
            issuedAt: issuedAt,
            deviceId: deviceId,
            userId: userId
        }).exec();
        return !!result;  //!! - конвертирует переменную в логическое значение

    };
    async create(issuedAt: number, expirationAt: number, deviceId: string,
                 deviceIp: string, deviceName: string, userId: string): Promise<boolean> {
        try {
            await RefreshTokensMetaModel.create({
                issuedAt: issuedAt,
                expirationAt: expirationAt,
                deviceId: deviceId,
                deviceIp: deviceIp,
                deviceName: deviceName,
                userId: userId
            });
            return true;
        }
        catch (e) {
            console.log(e)
            return false;
        }
    };
    async update(issuedAt: number, expirationAt: number, deviceId: string,
                 deviceIp: string, userId: string): Promise<boolean> {
        return (await RefreshTokensMetaModel.updateOne({deviceId: deviceId, userId: userId},
            {
                issuedAt: issuedAt,
                expirationAt: expirationAt,
                deviceIp: deviceIp
            }).exec()).matchedCount === 1;
    };
    async deleteByUserIdAndDeviceId(userId: string, deviceId: string): Promise<boolean> {
        return (await RefreshTokensMetaModel.deleteOne({
            userId: userId,
            deviceId: deviceId
        }).exec()).deletedCount === 1;
    };
    async deleteById(userId: string): Promise<boolean> {
        return (await RefreshTokensMetaModel.deleteMany({userId: userId}).exec()).acknowledged;
    };
    async deleteAll(): Promise<boolean> {
        return (await RefreshTokensMetaModel.deleteMany().exec()).acknowledged;
    };
    async findByUserId(userId: string) {
        return await RefreshTokensMetaModel.find({userId: userId}).select({_id: 0}).exec();
    };
    async findByDeviceId(deviceId: string) {
        return await RefreshTokensMetaModel.findOne({deviceId: deviceId}).select({_id: 0}).exec();
    };
    async deleteAllExceptCurrent(userId: string, deviceId: string): Promise<boolean> {
        return (await RefreshTokensMetaModel.deleteMany({userId: userId})
            .where('deviceId').ne(deviceId).exec()).acknowledged;
    };
    async deleteByDeviceId(deviceId: string): Promise<boolean> {
        return (await RefreshTokensMetaModel.deleteOne({deviceId: deviceId}).exec()).deletedCount === 1;
    };
}