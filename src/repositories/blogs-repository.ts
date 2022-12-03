import {blogsCollection} from "./db";
import {BlogUpdateModel} from "../models/blog-update-model";
import {BlogCreateModel} from "../models/blog-create-model";
import {BlogsViewModel} from "../models/blogs-view-model";

export const blogsRepository = { //объект с методами управления данными
    async findBlogById(id: string): Promise<BlogsViewModel | null> {
        return blogsCollection.findOne({id: id}, {projection: {
                _id: 0,
                id: 1,
                name: 1,
                description: 1,
                websiteUrl: 1
            }});
    },
    async deleteBlogByTd(id: string): Promise<boolean> {
        return (await blogsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async createBlog(newBlog: BlogCreateModel): Promise<boolean> {
        return (await blogsCollection.insertOne({...newBlog})).acknowledged;
    },
    async updateBlog(updateBlog: BlogUpdateModel): Promise<boolean> {
        return (await blogsCollection.updateOne({id: updateBlog.id}, { $set: {
                name: updateBlog.name,
                description: updateBlog.description,
                websiteUrl: updateBlog.websiteUrl
            }})).matchedCount === 1;
    },
    async deleteAllBlogs(): Promise<boolean> {
        return (await blogsCollection.deleteMany({})).acknowledged;
    }
}