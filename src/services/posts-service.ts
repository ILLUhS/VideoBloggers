import {postsRepository} from "../repositories/posts-repository";
import {queryRepository} from "../repositories/query-repository";
import {blogsRepository} from "../repositories/blogs-repository";
import {v4 as uuidv4} from "uuid";

export const postsService = {
    async deletePostByTd(id: string) {
        return await postsRepository.deletePostByTd(id);
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
            const result = await postsRepository.createPost(newPost);
            return result ? newPost.id : '';
        }
        return null;
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundBlog = await blogsRepository.findBlogById(blogId);
        if(foundBlog) {
            const updatePost = {
                id: id,
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name
            };
            return await postsRepository.updatePost(updatePost);
        }
        return false;
    },
    async deleteAllPosts() {
        return await postsRepository.deleteAllPosts();
    }
};