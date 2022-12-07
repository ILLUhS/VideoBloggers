import jwt from 'jsonwebtoken';
import {settings} from "../config/settings";

export const jwyService = {
    async createJWT(userId: String) {
        return jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: '7 days'});
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET);
            return result.userId;
        }
        catch (error) {
            return null;
        }
    }
}