import {SortDirection} from "mongodb";

export type SearchUsersParamsModel = {
    searchLoginTerm: string;
    searchEmailTerm: string;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection;
}