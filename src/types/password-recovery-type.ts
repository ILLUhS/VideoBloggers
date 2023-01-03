export type PasswordRecoveryType = {
    recoveryCode: string;
    expirationTime: Date;
    isUsed: boolean;
}