export type RefreshTokensMetaModel = {
    issuedAt: number;
    expirationAt: number;
    deviceId: string;
    deviceIp: string;
    deviceName: string;
    userId: string;
}