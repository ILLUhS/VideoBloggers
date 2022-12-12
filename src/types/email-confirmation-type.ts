export type EmailConfirmationType = {
    confirmationCode: string;
    expirationTime: Date;
    isConfirmed: boolean;
}