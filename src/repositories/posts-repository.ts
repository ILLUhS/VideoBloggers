import {PostModel} from "./db";
import {PostCreateType} from "../types/create-model-types/post-create-type";
import {PostUpdateType} from "../types/update-model-types/post-update-type";

export const postsRepository = {       //объект с методами управления данными
    async deleteByTd(id: string): Promise<boolean> {
        return (await PostModel.deleteOne({id: id}).exec()).deletedCount === 1;
        //return (await postsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async create(newPost: PostCreateType): Promise<boolean> {
        try {
            await PostModel.create(newPost);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
        //return (await postsCollection.insertOne({...newPost})).acknowledged;
    },
    async update(updatePost: PostUpdateType): Promise<boolean> {
        return (await PostModel.updateOne({id: updatePost.id}, {
            title: updatePost.title,
            shortDescription: updatePost.shortDescription,
            content: updatePost.content,
            blogId: updatePost.blogId,
            blogName: updatePost.blogName
        }).exec()).matchedCount === 1;
        /*return (await postsCollection.updateOne({id: updatePost.id}, { $set:{
                title: updatePost.title,
                shortDescription: updatePost.shortDescription,
                content: updatePost.content,
                blogId: updatePost.blogId,
                blogName: updatePost.blogName
            }})).matchedCount === 1;*/
    },
    async deleteAll(): Promise<boolean> {
        return (await PostModel.deleteMany().exec()).acknowledged;
        //return (await postsCollection.deleteMany({})).acknowledged;
    },
    async findById(id: string) {
        return await PostModel.findOne({id: id}).select({
            _id: 0,
            id: 1,
            title: 1,
            shortDescription: 1,
            content: 1,
            blogId: 1,
            blogName: 1,
            createdAt: 1
        }).exec();
        /*return postsCollection.findOne({id: id}, {
            projection: {
                _id: 0,
                id: 1,
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1
            }
        });*/
    }
}