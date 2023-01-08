import {BlogModel} from "./db";
import {BlogUpdateType} from "../types/update-model-types/blog-update-type";
import {BlogCreateType} from "../types/create-model-types/blog-create-type";
import {BlogsViewType} from "../types/view-model-types/blogs-view-type";

export const blogsRepository = { //объект с методами управления данными
    async findById(id: string): Promise<BlogsViewType | null> {
        return await BlogModel.findOne({id: id}).select({
            _id: 0,
            id: 1,
            name: 1,
            description: 1,
            websiteUrl: 1,
            createdAt: 1
        }).exec();
        /*return blogsCollection.findOne({id: id}, {projection: {
                _id: 0,
                id: 1,
                name: 1,
                description: 1,
                websiteUrl: 1,
                createdAt: 1
            }});*/
    },
    async deleteByTd(id: string): Promise<boolean> {
        return (await BlogModel.deleteOne({id: id}).exec()).deletedCount === 1;
        //return (await blogsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async create(newBlog: BlogCreateType): Promise<boolean> {
        try {
            await BlogModel.create(newBlog);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
        //return (await blogsCollection.insertOne({...newBlog})).acknowledged;
    },
    async update(updateBlog: BlogUpdateType): Promise<boolean> {
        return (await BlogModel.updateOne({id: updateBlog.id}, {
            name: updateBlog.name,
            description: updateBlog.description,
            websiteUrl: updateBlog.websiteUrl
        }).exec()).matchedCount === 1;
    },
    async deleteAll(): Promise<boolean> {
        return (await BlogModel.deleteMany().exec()).acknowledged;
        //return (await blogsCollection.deleteMany({})).acknowledged;
    }
}