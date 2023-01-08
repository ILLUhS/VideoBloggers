import {AccountDataType} from "../account-data-type";
import {EmailConfirmationType} from "../email-confirmation-type";

export type UserCreateType = {
    "id": string;
    "accountData": AccountDataType;
    "emailConfirmation": EmailConfirmationType;
}