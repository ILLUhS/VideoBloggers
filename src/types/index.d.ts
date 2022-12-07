import {UserViewModel} from "../models/user-view-model";

declare global {
    declare namespace Express {
        export interface Request {
            user: UserViewModel | null
        }
    }
}