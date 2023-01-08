import {blogsCollection} from "./db";
import {BlogUpdateType} from "../types/update-model-types/blog-update-type";
import {BlogCreateType} from "../types/create-model-types/blog-create-type";
import {BlogsViewType} from "../types/view-model-types/blogs-view-type";

export const blogsRepository = { //объект с методами управления данными
    async findById(id: string): Promise<BlogsViewType | null> {
        return blogsCollection.findOne({id: id}, {projection: {
                _id: 0,
                id: 1,
                name: 1,
                description: 1,
                websiteUrl: 1,
                createdAt: 1
            }});
    },
    async deleteByTd(id: string): Promise<boolean> {
        return (await blogsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async create(newBlog: BlogCreateType): Promise<boolean> {
        return (await blogsCollection.insertOne({...newBlog})).acknowledged;
    },
    async update(updateBlog: BlogUpdateType): Promise<boolean> {
        return (await blogsCollection.updateOne({id: updateBlog.id}, { $set: {
                name: updateBlog.name,
                description: updateBlog.description,
                websiteUrl: updateBlog.websiteUrl
            }})).matchedCount === 1;
    },
    async deleteAll(): Promise<boolean> {
        return (await blogsCollection.deleteMany({})).acknowledged;
    }
}