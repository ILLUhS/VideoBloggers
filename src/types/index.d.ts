import {UserViewModel} from "./models/user-view-model";
import {QueryParamsModel} from "./models/query-params-model";
import {RefreshTokenPayloadType} from "./refresh-token-payload-type";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null;
            searchParams: QueryParamsModel | null;
            payload: RefreshTokenPayloadType | null;
        }
    }
}