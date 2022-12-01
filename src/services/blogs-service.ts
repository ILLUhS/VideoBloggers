import {blogsRepository} from "../repositories/blogs-repository";
import {postsService} from "./posts-service";

export const blogsService = {       //объект с методами управления данными
    async deleteBlogByTd(id: string) {
        return await blogsRepository.deleteBlogByTd(id);
    },
    async createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: String((new Date()).valueOf()),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        };
        await blogsRepository.createBlog(newBlog)
        return newBlog;
    },
    async createPostByBlogId(title: string, shortDescription: string, content: string, blogId: string) {
        return await postsService.createPost(title, shortDescription,content, blogId);
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        const updateBlog = {
            id: id,
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }
        return blogsRepository.updateBlog(updateBlog);
    },
    async allBlogsDelete() {
        await blogsRepository.allBlogsDelete()
    }
}