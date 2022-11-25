import {blogsRepository} from "./blogs-repository";
import {postsCollection} from "./db";

export const postsRepository = {       //объект с методами управления данными
    async returnAllPosts() {
        return postsCollection.find().project({_id: 0}).toArray();
    },
    async findPostById(id: string) {
        return postsCollection.findOne({id: id}, {projection:{_id:0}}); //object || undefined
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
            return postsCollection.findOne({id: newPost.id}, {projection:{_id:0}});
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