import * as dotenv from 'dotenv';
dotenv.config();
export const settings = {
    MONGO_URL: process.env.MONGO_URL || "mongodb://127.0.0.1:27017",
    JWT_SECRET: process.env.JWT_SECRET || "123"
}