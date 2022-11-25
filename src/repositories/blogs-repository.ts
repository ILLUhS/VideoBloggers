import {blogsCollection, BlogsType} from "./db";
import {ObjectId} from "mongodb";

export const blogsRepository = {       //объект с методами управления данными
    async returnAllBlogs () {
        return blogsCollection.find().toArray();
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return blogsCollection.findOne({_id: new ObjectId(id)})  //object || undefined
    },
    async deleteBlogByTd(id: string) {
        return (await blogsCollection.deleteOne({_id: new ObjectId(id)})).deletedCount === 1;
    },
    async createBlog(name: string, description: string, websiteUrl: string) {
        const result = await blogsCollection.insertOne({
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        });
        return blogsRepository.findBlogById(result.insertedId.toString());
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        return (await blogsCollection.updateOne({_id: new ObjectId(id)}, { $set: {
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }})).matchedCount === 1;
    },
    async allBlogsDelete() {
        await blogsCollection.deleteMany({})
    }
}