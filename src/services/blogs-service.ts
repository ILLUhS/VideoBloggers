import {BlogsRepository} from "../repositories/blogs-repository";
import {inject, injectable} from "inversify";
import {BlogModel} from "../domain/mongoose-schemas/blog-schema";
import {PostsRepository} from "../repositories/posts-repository";

@injectable()
export class BlogsService {       //объект с методами управления данными
    constructor(@inject(BlogsRepository) protected blogsRepository: BlogsRepository,
                @inject(PostsRepository) protected postsRepository: PostsRepository) {
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
        const posts = await this.postsRepository.findPostsByBlogId(id);
        posts!.forEach(p => {
            p.updateBlogName(name);
            this.postsRepository.save(p);
        });
        return await this.blogsRepository.save(blog);
    };
    async deleteBlogByTd(id: string) {
        return await this.blogsRepository.deleteByTd(id);
    };
    async deleteAllBlogs() {
        return await this.blogsRepository.deleteAll()
    };
}