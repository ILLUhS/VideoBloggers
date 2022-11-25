import {blogsRepository} from "./blogs-repository";
import {ObjectId} from "mongodb";
import {postsCollection} from "./db";

export const postsRepository = {       //объект с методами управления данными
    async returnAllPosts() {
        return postsCollection.find().toArray();
    },
    async findPostById(id: string) {
        return postsCollection.findOne({id: id}); //object || undefined
    },
    async deletePostByTd(id: string) {
        return (await postsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = await blogsRepository.findBlogById(blogId);
        if(currentBlog) {
            const newPost = {
                id: String((new Date()).valueOf()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: String(currentBlog.id),
                blogName: currentBlog.name,
                createdAt: new Date().toISOString()
            };
            await postsCollection.insertOne(newPost);
            //return postsRepository.findPostById(result.insertedId.toString());
            return newPost;
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundBlog = await blogsRepository.findBlogById(blogId);
        if(foundBlog) {
            return (await postsCollection.updateOne({id: id}, { $set:{
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