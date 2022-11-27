import {blogsCollection, BlogsType} from "./db";

export const blogsRepository = {       //объект с методами управления данными
    async returnAllBlogs () {
        return blogsCollection.find().project({_id: 0}).toArray();
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return blogsCollection.findOne({id: id}, {projection:{_id:0}})  //object || undefined
    },
    async deleteBlogByTd(id: string) {
        return (await blogsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: String((new Date()).valueOf()),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        };
        await blogsCollection.insertOne({...newBlog});
        return newBlog; //blogsCollection.findOne({id: newBlog.id}, {projection:{_id:0}});
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        return (await blogsCollection.updateOne({id: id}, { $set: {
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }})).matchedCount === 1;
    },
    async allBlogsDelete() {
        await blogsCollection.deleteMany({})
    }
}