import {blogsRepository} from "../repositories/blogs-repository";
import {postsService} from "./posts-service";
import { v4 as uuidv4 } from 'uuid'
export const blogsService = {       //объект с методами управления данными
    async findBlogById(id: string) {
        return await blogsRepository.findById(id);
    },
    async createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: uuidv4(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        };
        const result = await blogsRepository.create(newBlog);
        return result ? newBlog.id : null;
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
        return blogsRepository.update(updateBlog);
    },
    async deleteBlogByTd(id: string) {
        return await blogsRepository.deleteByTd(id);
    },
    async deleteAllBlogs() {
        return await blogsRepository.deleteAll()
    }
};