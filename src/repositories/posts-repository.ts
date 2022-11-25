import {blogsRepository} from "./blogs-repository";
import {ObjectId} from "mongodb";
import {postsCollection} from "./db";

export const postsRepository = {       //объект с методами управления данными
    async returnAllPosts() {
        return postsCollection.find().toArray();
    },
    async findPostById(id: string) {
        return postsCollection.findOne({_id: new ObjectId(id)}); //object || undefined
    },
    async deletePostByTd(id: string) {
        return (await postsCollection.deleteOne({_id: new ObjectId(id)})).deletedCount === 1;
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = await blogsRepository.findBlogById(blogId);
        if(currentBlog) {
            const newPost = {
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: String(currentBlog._id),
                blogName: currentBlog.name,
                createdAt: new Date().toISOString()
            };
            const result = await postsCollection.insertOne(newPost);
            return postsRepository.findPostById(result.insertedId.toString());
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundBlog = await blogsRepository.findBlogById(blogId);
        if(foundBlog) {
            return (await postsCollection.updateOne({_id: new ObjectId(id)}, { $set:{
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name
            }})).matchedCount === 1;
        }
    },
    async allPostsDelete() {
        await postsCollection.deleteMany({})
    }
}