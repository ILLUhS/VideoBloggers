import {SortOrder} from "mongoose";

export type QueryParamsModel = {
    searchNameTerm: string;
    searchLoginTerm: string;
    searchEmailTerm: string;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortOrder;
}