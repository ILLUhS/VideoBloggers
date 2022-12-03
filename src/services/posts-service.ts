import {postsRepository} from "../repositories/posts-repository";
import {queryRepository} from "../repositories/query-repository";
import {v4 as uuidv4} from "uuid";
import {blogsService} from "./blogs-service";

export const postsService = {
    async deletePostByTd(id: string) {
        return await postsRepository.deleteByTd(id);
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = await queryRepository.findBlogById(blogId);
        if(currentBlog) {
            const newPost = {
                id: uuidv4(),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: currentBlog.name,
                createdAt: new Date().toISOString()
            };
            const result = await postsRepository.create(newPost);
            return result ? newPost.id : '';
        }
        return null;
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundBlog = await blogsService.findBlogById(blogId);
        if(foundBlog) {
            const updatePost = {
                id: id,
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name
            };
            return await postsRepository.update(updatePost);
        }
        return false;
    },
    async deleteAllPosts() {
        return await postsRepository.deleteAll();
    }
};