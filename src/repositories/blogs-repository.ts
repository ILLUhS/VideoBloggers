import {blogsCollection, BlogsType} from "./db";
import {ObjectId} from "mongodb";


type BlogsRepositoryType = {
    blogs: BlogsType[];
};
const blogsRepositoryDb: BlogsRepositoryType = {
    blogs: []
};

export const blogsRepository = {       //объект с методами управления данными
    async returnAllBlogs () {
        return blogsCollection.find().toArray();//blogsRepositoryDb.blogs;
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return blogsCollection.findOne({_id: new ObjectId(id)}) //blogsRepositoryDb.blogs.find(b => b.id === id); //array || undefined
    },
    async deleteBlogByTd(id: string) {
        return (await blogsCollection.deleteOne({_id: new ObjectId(id)})).deletedCount === 1;
        /*for(let i = 0; i < blogsRepositoryDb.blogs.length; i++) {
            if(blogsRepositoryDb.blogs[i].id === id) {
                blogsRepositoryDb.blogs.splice(i, 1);
                return true;
            }
        }
        return false*/
    },
    async createBlog(name: string, description: string, websiteUrl: string) {
        const result = await blogsCollection.insertOne({
            //id: String((new Date()).valueOf()),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        });
        return blogsRepository.findBlogById(result.insertedId.toString());
        /*const newBlog = {
            id: String((new Date()).valueOf()),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        };
        blogsRepositoryDb.blogs.push(newBlog);
        return newBlog;*/
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        return (await blogsCollection.updateOne({_id: new ObjectId(id)}, { $set: {
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }})).matchedCount === 1;
        /*const foundBlogsUpdate = blogsRepositoryDb.blogs.find(b => b.id === id);
        if(foundBlogsUpdate) {
            foundBlogsUpdate.name = name;
            foundBlogsUpdate.description = description;
            foundBlogsUpdate.websiteUrl = websiteUrl;
            return true;
        }
        else {
            return false;
        }*/
    },
    async allBlogsDelete() {
        await blogsCollection.deleteMany({})
        //blogsRepositoryDb.blogs = [];
    }
}