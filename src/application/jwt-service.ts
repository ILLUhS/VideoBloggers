import jwt from 'jsonwebtoken';
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
    },
    async getUserIdByRefreshToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.RefreshJWT_SECRET!);
            const tokenIsExpired = await refreshTokenRepository.find(token);
            if(tokenIsExpired)
                return null;
            return String(result.userId);
        }
        catch (error) {
            console.log(error);
            return null;
        }
    },
    async createRefreshJWT(userId: string) {
        return jwt.sign({userId: userId}, settings.RefreshJWT_SECRET!, {expiresIn: '20s'});
    },
    async addRefreshTokenInBlackList(token: string) {
        await refreshTokenRepository.create(token);
    },
    async clearRefreshTokenBlackList() {
        return refreshTokenRepository.deleteAll();
    }
}