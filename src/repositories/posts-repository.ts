import {postsCollection} from "./db";
import {queryRepository} from "./query-repository";

export const postsRepository = {       //объект с методами управления данными
    async deletePostByTd(id: string) {
        return (await postsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = await queryRepository.findBlogById(blogId);
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
            await postsCollection.insertOne({...newPost});
            return newPost; //postsCollection.findOne({id: newPost.id}, {projection:{_id:0}});
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundBlog = await queryRepository.findBlogById(blogId);
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