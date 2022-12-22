export type RefreshTokensMetaModel = {
    issueAt: number;
    expirationAt: number;
    deviceId: string;
    deviceIp: string;
    deviceName: string;
    userId: string;
}