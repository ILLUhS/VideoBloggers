import {blogsRepository} from "./blogs-repository";
type PostsType = {
    id: string;
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
    findPostById(id: string) {
        return postsRepositoryDb.posts.find(p => p.id === id); //array || undefined
    },
    deletePostByTd(id: string) {
        for(let i = 0; i < postsRepositoryDb.posts.length; i++) {
            if(postsRepositoryDb.posts[i].id === id) {
                postsRepositoryDb.posts.splice(i, 1);
                return true;
            }
        }
        return false
    },
    createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = blogsRepository.findBlogById(blogId);
        if(currentBlog) {
            const newPost = {
                id: String((new Date()).valueOf()),
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
    updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        const foundPostsUpdate = postsRepositoryDb.posts.find(b => b.id === id);
        const foundBlog = blogsRepository.findBlogById(String(blogId));
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