import * as dotenv from 'dotenv';
dotenv.config();
export const settingsEnv = {
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017",
    JWT_SECRET: process.env.JWT_SECRET,
    RefreshJWT_SECRET: process.env.RefreshJWT_SECRET,
    PORT: process.env.PORT || 3000,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_LOGIN: process.env.EMAIL_LOGIN
}