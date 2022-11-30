import {postsCollection} from "./db";
import {PostCreateModel} from "../models/post-create-model";
import {PostUpdateModel} from "../models/post-update-model";

export const postsRepository = {       //объект с методами управления данными
    async deletePostByTd(id: string): Promise<boolean> {
        return (await postsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async createPost(newPost: PostCreateModel): Promise<void> {
        await postsCollection.insertOne({...newPost});
    },
    async updatePost(updatePost: PostUpdateModel): Promise<boolean> {
        return (await postsCollection.updateOne({id: updatePost.id}, { $set:{
                title: updatePost.title,
                shortDescription: updatePost.shortDescription,
                content: updatePost.content,
                blogId: updatePost.blogId,
                blogName: updatePost.blogName
            }})).matchedCount === 1;
    },
    async allPostsDelete(): Promise<void> {
        await postsCollection.deleteMany({})
    }
}