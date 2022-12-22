export type RefreshTokenPayloadType = {
    deviceId: string;
    userId: string;
    iat: number;
    exp: number;
}