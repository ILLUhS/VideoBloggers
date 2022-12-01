import {blogsCollection, BlogsType} from "./db";
import {BlogUpdateModel} from "../models/blog-update-model";
import {BlogCreateModel} from "../models/blog-create-model";

export const blogsRepository = {
    async findBlogById(id: string): Promise<BlogsType | null> {
        return blogsCollection.findOne({id: id}, {projection:{_id:0}})  //object || undefined
    },//объект с методами управления данными
    async deleteBlogByTd(id: string): Promise<boolean> {
        return (await blogsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async createBlog(newBlog: BlogCreateModel): Promise<void> {
        await blogsCollection.insertOne({...newBlog});
    },
    async updateBlog(updateBlog: BlogUpdateModel): Promise<boolean> {
        return (await blogsCollection.updateOne({id: updateBlog.id}, { $set: {
                name: updateBlog.name,
                description: updateBlog.description,
                websiteUrl: updateBlog.websiteUrl
            }})).matchedCount === 1;
    },
    async allBlogsDelete(): Promise<void> {
        await blogsCollection.deleteMany({})
    }
}