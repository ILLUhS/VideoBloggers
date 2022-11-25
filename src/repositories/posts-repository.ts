import {blogsRepository} from "./blogs-repository";
import {postsCollection} from "./db";

export const postsRepository = {       //объект с методами управления данными
    async returnAllPosts() {
        return postsCollection.find().toArray();
    },
    async findPostById(id: string) {
        return postsCollection.findOne({_id: id}); //object || undefined
    },
    async deletePostByTd(id: string) {
        return (await postsCollection.deleteOne({_id: id})).deletedCount === 1;
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = await blogsRepository.findBlogById(blogId);
        if(currentBlog) {
            const newPost = {
                _id: String((new Date()).valueOf()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: String(currentBlog._id),
                blogName: currentBlog.name,
                createdAt: new Date().toISOString()
            };
            await postsCollection.insertOne(newPost);
            return newPost;
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundBlog = await blogsRepository.findBlogById(blogId);
        if(foundBlog) {
            return (await postsCollection.updateOne({_id: id}, { $set:{
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