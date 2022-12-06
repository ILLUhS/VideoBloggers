import jwt from 'jsonwebtoken';
import {settings} from "../config/settings";

export const jwyService = {
    async createJWT(userId: String) {
        return jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: '7 days'});
    }
}