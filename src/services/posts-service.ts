import {v4 as uuidv4} from "uuid";
import {CommentsService} from "./comments-service";
import {PostsRepository} from "../repositories/posts-repository";
import {QueryRepository} from "../repositories/query-repository";

export class PostsService {
    constructor(protected postsRepository: PostsRepository,
                protected commentsService: CommentsService,
                protected queryRepository: QueryRepository) { };
    async findPostById(id: string) {
        return await this.postsRepository.findById(id);
    };
    async deletePostByTd(id: string) {
        return await this.postsRepository.deleteByTd(id);
    };
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = await this.queryRepository.findBlogById(blogId);
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
            const result = await this.postsRepository.create(newPost);
            return result ? newPost.id : null;
        }
        return null;
    };
    async createCommentByPostId(content: string, userId: string, userLogin: string, postId: string) {
        return await this.commentsService.createComment(content, userId, userLogin, postId);
    };
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundBlog = await this.queryRepository.findBlogById(blogId);
        if(foundBlog) {
            const updatePost = {
                id: id,
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name
            };
            return await this.postsRepository.update(updatePost);
        }
        return false;
    };
    async deleteAllPosts() {
        return await this.postsRepository.deleteAll();
    };
}