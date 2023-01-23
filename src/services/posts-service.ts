import {CommentsService} from "./comments-service";
import {PostsRepository} from "../repositories/posts-repository";
import {QueryRepository} from "../repositories/query-repository";
import {inject, injectable} from "inversify";
import {PostModel} from "../domain/mongoose-schemas/post-schema";

@injectable()
export class PostsService {
    constructor(@inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(CommentsService)protected commentsService: CommentsService,
                @inject(QueryRepository)protected queryRepository: QueryRepository) { };
    async findPostById(id: string) {
        return await this.postsRepository.findById(id);
    };
    async deletePostByTd(id: string) {
        return await this.postsRepository.deleteByTd(id);
    };
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = await this.queryRepository.findBlogById(blogId);
        if(!currentBlog)
            return null;
        const newPost = PostModel.makeInstance(title, shortDescription,
            content, blogId, currentBlog.name);
        const result = await this.postsRepository.save(newPost);
        return result ? newPost.id : null;
    };
    async createCommentByPostId(content: string, userId: string, userLogin: string, postId: string) {
        return await this.commentsService.createComment(content, userId, userLogin, postId);
    };
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundBlog = await this.queryRepository.findBlogById(blogId);
        if(!foundBlog)
            return false;
        const post = await this.postsRepository.findById(id);
        if(!post)
            return false;
        post.updateProperties(title, shortDescription, content, blogId, foundBlog.name);
        return await this.postsRepository.save(post);
    };
    async deleteAllPosts() {
        return await this.postsRepository.deleteAll();
    };
}