import {UserViewType} from "./view-model-types/user-view-type";
import {QueryParamsType} from "./query-params-type";
import {RefreshTokenPayloadType} from "./refresh-token-payload-type";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewType | null;
            searchParams: QueryParamsType | null;
            payload: RefreshTokenPayloadType | null;
        }
    }
}