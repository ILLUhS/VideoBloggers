import {blogsRepository} from "../repositories/blogs-repository";
type PostsType = {
    id: number;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
};
type PostsRepositoryType = {
    posts: PostsType[];
};
const postsRepositoryDb: PostsRepositoryType = {
    posts: []
};

export const postsRepository = {       //объект с методами управления данными
    returnAllPosts() {
        return postsRepositoryDb.posts;
    },
    findPostById(id: number) {
        return postsRepositoryDb.posts.find(p => p.id === id); //array || undefined
    },
    deletePostByTd(id: number) {
        for(let i = 0; i < postsRepositoryDb.posts.length; i++) {
            if(postsRepositoryDb.posts[i].id === id) {
                postsRepositoryDb.posts.splice(i, 1);
                return true;
            }
        }
        return false
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = blogsRepository.findBlogById(Number(blogId));
        if(currentBlog) {
            const newPost = {
                id: Number(new Date()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: String(currentBlog.id),
                blogName: String(currentBlog.name)
            };
            postsRepositoryDb.posts.push(newPost);
            return newPost;
        }
    },
    updatePost(id: number, title: string, shortDescription: string, content: string, blogId: string) {
        const foundPostsUpdate = postsRepositoryDb.posts.find(b => b.id === id);
        const foundBlog = blogsRepository.findBlogById(Number(blogId));
        if(foundPostsUpdate && foundBlog) {
            foundPostsUpdate.title = title;
            foundPostsUpdate.shortDescription = shortDescription;
            foundPostsUpdate.content = content;
            foundPostsUpdate.blogId = blogId;
            foundPostsUpdate.blogName = foundBlog.name;
            return true;
        }
        else {
            return false;
        }
    },
    allPostsDelete() {
        postsRepositoryDb.posts = [];
    }
}