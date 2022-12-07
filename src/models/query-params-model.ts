import {SortDirection} from "mongodb";

export type QueryParamsModel = {
    searchNameTerm: string;
    searchLoginTerm: string;
    searchEmailTerm: string;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection;
}