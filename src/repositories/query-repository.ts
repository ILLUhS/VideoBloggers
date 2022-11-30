import {searchParamsPosts} from "../middlewares/input-validation-middleware";
import {blogsCollection, BlogsType, postsCollection} from "./db";
export const queryRepository = {
    async getBlogsWithQueryParam(searchParams: searchParamsPosts) {
        const blogs = await blogsCollection.find({name: { $regex:  searchParams.searchNameTerm, $options: 'i'}},
            {
                skip: (searchParams.pageNumber - 1) * searchParams.pageSize,
                limit: searchParams.pageSize,
                sort: [[searchParams.sortBy, searchParams.sortDirection]]
            }).project({_id: 0}).toArray();
        const blogsCount = await blogsCollection.countDocuments({name:  new RegExp(searchParams.searchNameTerm, 'i')});
        return {
            pagesCount: Math.ceil(blogsCount / searchParams.pageSize),
            page: searchParams.pageNumber,
            pageSize: searchParams.pageSize,
            totalCount: blogsCount,
            items: blogs.map(blog => ({
                id: blog.id,
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt
            }))
        }
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return blogsCollection.findOne({id: id}, {projection:{_id:0}})  //object || undefined
    },
    async returnAllBlogs () {
        return blogsCollection.find().project({_id: 0}).toArray();
    },
    async getPotsWithQueryParamAndBlogId(searchParams: searchParamsPosts, blogId: string) {
        const posts = await postsCollection.find({blogId: blogId},
            {
                skip: (searchParams.pageNumber - 1) * searchParams.pageSize,
                limit: searchParams.pageSize,
                sort: [[searchParams.sortBy, searchParams.sortDirection]]
            }).project({_id: 0}).toArray();
        const postsCount = await postsCollection.countDocuments({blogId:  blogId});
        return {
            pagesCount: Math.ceil(postsCount / searchParams.pageSize),
            page: searchParams.pageNumber,
            pageSize: searchParams.pageSize,
            totalCount: postsCount,
            items: posts.map(post => ({
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            }))
        }
    },
    async getPotsWithQueryParam(searchParams: searchParamsPosts) {
        const posts = await postsCollection.find({},
            {
                skip: (searchParams.pageNumber - 1) * searchParams.pageSize,
                limit: searchParams.pageSize,
                sort: [[searchParams.sortBy, searchParams.sortDirection]]
            }).project({_id: 0}).toArray();
        const postsCount = await postsCollection.countDocuments({});
        return {
            pagesCount: Math.ceil(postsCount / searchParams.pageSize),
            page: searchParams.pageNumber,
            pageSize: searchParams.pageSize,
            totalCount: postsCount,
            items: posts.map(post => ({
                id: post.id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            }))
        }
    },
    async returnAllPosts() {
        return postsCollection.find().project({_id: 0}).toArray();
    },
    async findPostById(id: string) {
        return postsCollection.findOne({id: id}, {projection:{_id:0}}); //object || undefined
    }
}