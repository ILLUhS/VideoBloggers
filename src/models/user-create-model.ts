import {AccountDataType} from "../types/account-data-type";
import {EmailConfirmationType} from "../types/email-confirmation-type";

export type UserCreateModel = {
    "id": string;
    "accountData": AccountDataType;
    "emailConfirmation": EmailConfirmationType;
}