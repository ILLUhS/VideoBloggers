import {refreshTokensMetaRepository} from "../repositories/refresh-tokens-meta-repository";

export const sessionsService = {
    async getAllByUserId(userId: string) {
        const sessions = await refreshTokensMetaRepository.findByUserId(userId);
        return sessions.map(s => ({
            ip: s.deviceIp,
            title: s.deviceName,
            lastActiveDate: (new Date(s.issuedAt * 1000)).toISOString(),
            deviceId: s.deviceId
        }));
    },
    async getByDeviceId(deviceId: string) {
        return await refreshTokensMetaRepository.findByDeviceId(deviceId);
    },
    async deleteAllExceptCurrent(userId: string, deviceId: string) {
        return await refreshTokensMetaRepository.deleteAllExceptCurrent(userId, deviceId);
    },
    async deleteById(deviceId: string) {
        return await refreshTokensMetaRepository.deleteByDeviceId(deviceId);
    }
}