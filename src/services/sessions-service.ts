import {RefreshTokensMetaRepository} from "../repositories/refresh-tokens-meta-repository";
import {inject, injectable} from "inversify";

@injectable()
export class SessionsService {
    constructor(@inject(RefreshTokensMetaRepository)
                protected refreshTokensMetaRepository: RefreshTokensMetaRepository) { };
    async getAllByUserId(userId: string) {
        const sessions = await this.refreshTokensMetaRepository.findByUserId(userId);
        return sessions.map(s => ({
            ip: s.deviceIp,
            title: s.deviceName,
            lastActiveDate: (new Date(s.issuedAt * 1000)).toISOString(),
            deviceId: s.deviceId
        }));
    };
    async getByDeviceId(deviceId: string) {
        return await this.refreshTokensMetaRepository.findByDeviceId(deviceId);
    };
    async deleteAllExceptCurrent(userId: string, deviceId: string) {
        return await this.refreshTokensMetaRepository.deleteAllExceptCurrent(userId, deviceId);
    };
    async deleteById(deviceId: string) {
        return await this.refreshTokensMetaRepository.deleteByDeviceId(deviceId);
    };
}