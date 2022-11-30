import {SortDirection} from "mongodb";

export type SearchParamsModel = {
    searchNameTerm: string;
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: SortDirection;
}