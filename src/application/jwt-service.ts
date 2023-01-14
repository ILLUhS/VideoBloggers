import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {settings} from "../config/settings";
import {RefreshTokenPayloadType} from "../types/refresh-token-payload-type";
import {RefreshTokensMetaRepository} from "../repositories/refresh-tokens-meta-repository";

export class JwtService {
    constructor(protected refreshTokensMetaRepository: RefreshTokensMetaRepository) { };
    async createAccessJWT(userId: string) {
        return jwt.sign({userId: userId}, settings.JWT_SECRET!, {expiresIn: '600s'});
    };
    async getUserIdByToken(token: string) {
        try {
            const payload: any = jwt.verify(token, settings.JWT_SECRET!);
            return payload.userId;
        }
        catch (error) {
            console.log(error);
            return null;
        }
    };
    async getPayloadByRefreshToken(token: string): Promise<RefreshTokenPayloadType | null> {
        try {
            const payload: any = jwt.verify(token, settings.RefreshJWT_SECRET!);
            const tokenIsValid = await this.refreshTokensMetaRepository.find(payload.iat, payload.deviceId, payload.userId);
            if(!tokenIsValid)
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
    };
    async createRefreshJWT(userId: string, deviceName: string, deviceIp: string) {
        const deviceId = uuidv4();
        const token = jwt.sign({deviceId: deviceId, userId: userId}, settings.RefreshJWT_SECRET!, {expiresIn: '20000s'});
        const payload = JSON.parse(Buffer.from(token.split('.')[1], "base64").toString("ascii"));
        await this.refreshTokensMetaRepository.create(payload.iat, payload.exp, deviceId, deviceIp, deviceName, userId);
        return token;
    };
    async reCreateRefreshJWT(userId: string, deviceId: string, deviceIp: string) {
        const token = jwt.sign({deviceId: deviceId, userId: userId}, settings.RefreshJWT_SECRET!, {expiresIn: '20000s'});
        const payload = JSON.parse(Buffer.from(token.split('.')[1], "base64").toString("ascii"));
        await this.refreshTokensMetaRepository.update(payload.iat, payload.exp, deviceId, deviceIp, payload.userId);
        return token;
    };
    async deleteOneTokensMeta(userId: string, deviceId: string) {
        return await this.refreshTokensMetaRepository.deleteByUserIdAndDeviceId(userId, deviceId);
    };
    async deleteAllTokensMeta() {
        return this.refreshTokensMetaRepository.deleteAll();
    };
}