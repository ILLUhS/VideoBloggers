import {UserViewModel} from "./models/user-view-model";
import {QueryParamsModel} from "./models/query-params-model";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null;
            searchParams: QueryParamsModel | null;
        }
    }
}