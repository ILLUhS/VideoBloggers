import {BlogsRepository} from "../repositories/blogs-repository";
import {inject, injectable} from "inversify";
import {BlogModel} from "../domain/mongoose-schemas/blog-schema";

@injectable()
export class BlogsService {       //объект с методами управления данными
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository) {
    }
    async findBlogById(id: string) {
        return await this.blogsRepository.findById(id);
    };
    async createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = BlogModel.makeInstance(name, description, websiteUrl);
        const result = await this.blogsRepository.save(newBlog);
        return result ? newBlog.id : null;
    };
    async updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        const blog = await this.blogsRepository.findById(id);
        if(!blog)
            return false;
        blog.updateProperties(name, description, websiteUrl);
        return await this.blogsRepository.save(blog);
    };
    async deleteBlogByTd(id: string) {
        return await this.blogsRepository.deleteByTd(id);
    };
    async deleteAllBlogs() {
        return await this.blogsRepository.deleteAll()
    };
}