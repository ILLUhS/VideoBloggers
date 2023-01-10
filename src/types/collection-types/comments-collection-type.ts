import {ReactionsCollectionType} from "./reactions-collection-type";

export type CommentsCollectionType = {
    id: string;
    content: string;
    userId: string;
    userLogin: string;
    createdAt: string;
    postId: string;
    reactions: ReactionsCollectionType[];
}