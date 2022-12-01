import {postsRepository} from "../repositories/posts-repository";
import {queryRepository} from "../repositories/query-repository";
import {blogsRepository} from "../repositories/blogs-repository";

export const postsService = {
    async deletePostByTd(id: string) {
        return await postsRepository.deletePostByTd(id);
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = await queryRepository.findBlogById(blogId);
        if(currentBlog) {
            const newPost = {
                id: String((new Date()).valueOf()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: currentBlog.name,
                createdAt: new Date().toISOString()
            };
            await postsRepository.createPost(newPost);
            return newPost;
        }
        return false;
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
    async allPostsDelete() {
        await postsRepository.allPostsDelete();
    }
}