import {AccountDataType} from "../account-data-type";
import {EmailConfirmationType} from "../email-confirmation-type";
import {PasswordRecoveryType} from "../password-recovery-type";

export type UsersCollectionType = {
    "id": string;
    "accountData": AccountDataType;
    "emailConfirmation": EmailConfirmationType;
    "passwordRecovery"?: PasswordRecoveryType;
}