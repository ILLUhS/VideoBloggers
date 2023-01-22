import {HydratedDocument, Model} from 'mongoose';

export type BlogsCollectionType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
};
export type BlogModelMethods = {
    updateProperties(name: string, description: string, websiteUrl: string): void;
};
export type BlogModelStaticMethods = {
    makeInstance(name: string, description: string, websiteUrl: string): HydratedDocument<BlogsCollectionType, BlogModelType>;
};
export type BlogModelType = Model<BlogsCollectionType> & BlogModelMethods & BlogModelStaticMethods;