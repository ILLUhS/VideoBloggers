import {postsCollection} from "./db";
import {PostCreateType} from "../types/create-model-types/post-create-type";
import {PostUpdateType} from "../types/update-model-types/post-update-type";

export const postsRepository = {       //объект с методами управления данными
    async deleteByTd(id: string): Promise<boolean> {
        return (await postsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async create(newPost: PostCreateType): Promise<boolean> {
        return (await postsCollection.insertOne({...newPost})).acknowledged;
    },
    async update(updatePost: PostUpdateType): Promise<boolean> {
        return (await postsCollection.updateOne({id: updatePost.id}, { $set:{
                title: updatePost.title,
                shortDescription: updatePost.shortDescription,
                content: updatePost.content,
                blogId: updatePost.blogId,
                blogName: updatePost.blogName
            }})).matchedCount === 1;
    },
    async deleteAll(): Promise<boolean> {
        return (await postsCollection.deleteMany({})).acknowledged;
    },
    async findById(id: string) {
        return postsCollection.findOne({id: id}, {projection: {
                _id: 0,
                id: 1,
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1
            }});
    }
}