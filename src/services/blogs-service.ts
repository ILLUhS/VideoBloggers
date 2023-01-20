import { v4 as uuidv4 } from 'uuid';
import {BlogsRepository} from "../repositories/blogs-repository";
import {PostsService} from "./posts-service";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {       //объект с методами управления данными
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
                @inject(PostsService) protected postsService: PostsService) {
    }
    async findBlogById(id: string) {
        return await this.blogsRepository.findById(id);
    };
    async createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: uuidv4(),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        };
        const result = await this.blogsRepository.create(newBlog);
        return result ? newBlog.id : null;
    };
    async createPostByBlogId(title: string, shortDescription: string, content: string, blogId: string) {
        return await this.postsService.createPost(title, shortDescription,content, blogId);
    };
    async updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        const updateBlog = {
            id: id,
            name: name,
            description: description,
            websiteUrl: websiteUrl
        }
        return this.blogsRepository.update(updateBlog);
    };
    async deleteBlogByTd(id: string) {
        return await this.blogsRepository.deleteByTd(id);
    };
    async deleteAllBlogs() {
        return await this.blogsRepository.deleteAll()
    };
}