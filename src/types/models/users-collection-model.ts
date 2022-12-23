import {AccountDataType} from "../account-data-type";
import {EmailConfirmationType} from "../email-confirmation-type";

export type UsersCollectionModel = {
    "id": string;
    "accountData": AccountDataType;
    "emailConfirmation": EmailConfirmationType;
}