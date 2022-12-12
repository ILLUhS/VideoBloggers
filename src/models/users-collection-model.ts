import {AccountDataType} from "../types/account-data-type";
import {EmailConfirmationType} from "../types/email-confirmation-type";

export type UsersCollectionModel = {
    "id": string;
    "accountData": AccountDataType;
    "emailConfirmation": EmailConfirmationType;
}