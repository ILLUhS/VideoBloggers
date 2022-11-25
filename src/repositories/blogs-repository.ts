import {blogsCollection, BlogsType} from "./db";

export const blogsRepository = {       //объект с методами управления данными
    async returnAllBlogs () {
        return blogsCollection.find().toArray();
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return blogsCollection.findOne({_id: id})  //object || undefined
    },
    async deleteBlogByTd(id: string) {
        return (await blogsCollection.deleteOne({_id: id})).deletedCount === 1;
    },
    async createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = {
            _id: String((new Date()).valueOf()),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        };
        await blogsCollection.insertOne(newBlog);
        return newBlog;
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        return (await blogsCollection.updateOne({_id: id}, { $set: {
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }})).matchedCount === 1;
    },
    async allBlogsDelete() {
        await blogsCollection.deleteMany({})
    }
}