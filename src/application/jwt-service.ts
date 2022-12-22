import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import {settings} from "../config/settings";
import {refreshTokenRepository} from "../repositories/refresh-token-repository";

export const jwtService = {
    async createAccessJWT(userId: string) {
        return jwt.sign({userId: userId}, settings.JWT_SECRET!, {expiresIn: '10s'});
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET!);
            return result.userId;
        }
        catch (error) {
            console.log(error);
            return null;
        }
        // const result = jwt.verify(token, settings.JWT_SECRET!);
        // console.log('tooooo' + result);
        // if(typeof result === "string")
        //     return null;
        // return result.userId;
    },
    async getPayloadByRefreshToken(token: string) {
        try {
            const payload: any = jwt.verify(token, settings.RefreshJWT_SECRET!);
            const tokenIsValid = await refreshTokenRepository.find(token);
            if(tokenIsValid)
                return null;
            return payload;
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
        await refreshTokenRepository.create(payload.iat, payload.exp, deviceId, deviceIp, deviceName, userId);
        return token;
    },
    async reCreateRefreshJWT(userId: string, deviceName: string, deviceIp: string) {
        /*const deviceId = uuidv4();
        const token = jwt.sign({deviceId: deviceId, userId: userId}, settings.RefreshJWT_SECRET!, {expiresIn: '20s'});
        const payload = JSON.parse(token.split('.')[1]);
        await refreshTokenRepository.create(payload.iat, payload.exp, deviceId, deviceIp, deviceName, userId);
        return token;*/
    },
    async clearRefreshTokenBlackList() {
        return refreshTokenRepository.deleteAll();
    }
}