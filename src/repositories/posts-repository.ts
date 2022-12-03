import {postsCollection} from "./db";
import {PostCreateModel} from "../models/post-create-model";
import {PostUpdateModel} from "../models/post-update-model";

export const postsRepository = {       //объект с методами управления данными
    async deleteByTd(id: string): Promise<boolean> {
        return (await postsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async create(newPost: PostCreateModel): Promise<boolean> {
        return (await postsCollection.insertOne({...newPost})).acknowledged;
    },
    async update(updatePost: PostUpdateModel): Promise<boolean> {
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
    }
}