import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {settings} from "../config/settings";
import {refreshTokensMetaRepository} from "../repositories/refresh-tokens-meta-repository";
import {RefreshTokenPayloadType} from "../types/refresh-token-payload-type";

export const jwtService = {
    async createAccessJWT(userId: string) {
        return jwt.sign({userId: userId}, settings.JWT_SECRET!, {expiresIn: '10s'});
    },
    async getUserIdByToken(token: string) {
        try {
            const payload: any = jwt.verify(token, settings.JWT_SECRET!);
            return payload.userId;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    },
    async getPayloadByRefreshToken(token: string): Promise<RefreshTokenPayloadType | null> {
        try {
            const payload: any = jwt.verify(token, settings.RefreshJWT_SECRET!);
            const tokenIsValid = await refreshTokensMetaRepository.find(payload.issuedAt, payload.deviceId, payload.userId);
            if(tokenIsValid)
                return null;
            return {
                deviceId: payload.deviceId,
                userId: payload.userId
            };
        }
        catch (error) {
            console.log(error);
            return null;
        }
    },
    async createRefreshJWT(userId: string, deviceName: string, deviceIp: string) {
        const deviceId = uuidv4();
        const token = jwt.sign({deviceId: deviceId, userId: userId}, settings.RefreshJWT_SECRET!, {expiresIn: '20s'});
        const payload = JSON.parse(token.split('.')[1]);
        await refreshTokensMetaRepository.create(payload.iat, payload.exp, deviceId, deviceIp, deviceName, userId);
        return token;
    },
    async reCreateRefreshJWT(userId: string, deviceId: string, deviceIp: string) {
        const token = jwt.sign({deviceId: deviceId, userId: userId}, settings.RefreshJWT_SECRET!, {expiresIn: '20s'});
        const payload = JSON.parse(token.split('.')[1]);
        await refreshTokensMetaRepository.update(payload.iat, payload.exp, deviceId, deviceIp, payload.userId);
        return token;
    },
    async deleteOneTokensMeta(userId: string, deviceId: string) {
        return await refreshTokensMetaRepository.deleteByUserAndDeviceId(userId, deviceId);
    },
    async deleteAllTokensMeta() {
        return refreshTokensMetaRepository.deleteAll();
    }
}