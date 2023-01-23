import {ReactionsCollectionType} from "../../types/collection-types/reactions-collection-type";
import {HydratedDocument, Model} from "mongoose";

export type PostsCollectionType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    reactions: ReactionsCollectionType[];
};
export type PostModelStaticMethods = {
    makeInstance(title: string, shortDescription: string,
                 content: string, blogId: string, blogName: string): HydratedDocument<PostsCollectionType, PostModelType>;
};
export type PostModelMethods = {
    updateProperties(title: string, shortDescription: string,
                     content: string, blogId: string, blogName: string): void;
    updateBlogName(blogName: string): void;
};
export type PostModelType = Model<PostsCollectionType> & PostModelStaticMethods & PostModelMethods;