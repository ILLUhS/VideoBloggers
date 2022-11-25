import {blogsRepository} from "./blogs-repository";
import {ObjectId} from "mongodb";
import {blogsCollection, postsCollection, PostsType} from "./db";

type PostsRepositoryType = {
    posts: PostsType[];
};
const postsRepositoryDb: PostsRepositoryType = {
    posts: []
};

export const postsRepository = {       //объект с методами управления данными
    async returnAllPosts() {
        return postsCollection.find().toArray();
        //return postsRepositoryDb.posts;
    },
    async findPostById(id: string) {
        return postsCollection.findOne({_id: new ObjectId(id)});
        //return postsRepositoryDb.posts.find(p => p.id === id); //array || undefined
    },
    async deletePostByTd(id: string) {
        return (await postsCollection.deleteOne({_id: new ObjectId(id)})).deletedCount === 1;
        /*for(let i = 0; i < postsRepositoryDb.posts.length; i++) {
            if(postsRepositoryDb.posts[i].id === id) {
                postsRepositoryDb.posts.splice(i, 1);
                return true;
            }
        }
        return false*/
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string) {
        const currentBlog = await blogsRepository.findBlogById(blogId);
        if(currentBlog) {
            const newPost = {
                //id: String((new Date()).valueOf()),
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: String(currentBlog._id),
                blogName: currentBlog.name,
                createdAt: new Date().toISOString()
            };
            const result = await postsCollection.insertOne(newPost);
            return postsRepository.findPostById(result.insertedId.toString());
            //postsRepositoryDb.posts.push(newPost);
            //return newPost;
        }
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string) {
        //const foundPostsUpdate = postsRepositoryDb.posts.find(b => b.id === id);
        const foundBlog = await blogsRepository.findBlogById(blogId);
        /*if(foundPostsUpdate && foundBlog) {

            foundPostsUpdate.title = title;
            foundPostsUpdate.shortDescription = shortDescription;
            foundPostsUpdate.content = content;
            foundPostsUpdate.blogId = new ObjectId(blogId);
            foundPostsUpdate.blogName = foundBlog.name;
            return true;
        }
        else {
            return false;
        }*/
        if(foundBlog) {
            return (await postsCollection.updateOne({_id: new ObjectId(id)}, { $set:{
                title: title,
                shortDescription: shortDescription,
                content: content,
                blogId: blogId,
                blogName: foundBlog.name
            }})).matchedCount === 1;
        }
    },
    async allPostsDelete() {
        await postsCollection.deleteMany({})
        //postsRepositoryDb.posts = [];
    }
}