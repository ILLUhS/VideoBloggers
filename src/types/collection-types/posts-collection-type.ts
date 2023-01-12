import {ReactionsCollectionType} from "./reactions-collection-type";

export type PostsCollectionType = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
    createdAt: string;
    reactions: ReactionsCollectionType[];
}