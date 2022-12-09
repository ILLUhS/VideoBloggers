import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "./db";
import {BlogsViewModel} from "../models/blogs-view-model";
import {UserViewModel} from "../models/user-view-model";
import {CommentsViewModel} from "../models/comments-view-model";
import {QueryParamsModel} from "../models/query-params-model";
import {FilterType} from "../types/filter-type";

export const queryRepository = {
    async getBlogsWithQueryParam(searchParams: QueryParamsModel) {
        const blogs = await blogsCollection.find({name: { $regex:  searchParams.searchNameTerm, $options: 'i'}},
            {
                skip: (searchParams.pageNumber - 1) * searchParams.pageSize,
                limit: searchParams.pageSize,
                sort: [[searchParams.sortBy, searchParams.sortDirection]]
            }).project({
                _id: 0,
                id: 1,
                name: 1,
                description: 1,
                websiteUrl: 1,
                createdAt: 1
            }).toArray();
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
    async findBlogById(id: string): Promise<BlogsViewModel | null> {
        return blogsCollection.findOne({id: id}, {projection: {
                _id: 0,
                id: 1,
                name: 1,
                description: 1,
                websiteUrl: 1,
                createdAt: 1
            }});
    },
    async returnAllBlogs() {
        return blogsCollection.find().project({
            _id: 0,
            id: 1,
            name: 1,
            description: 1,
            websiteUrl: 1,
            createdAt: 1
        }).toArray();
    },
    async getPotsWithQueryParam(searchParams: QueryParamsModel, filter?: FilterType) {
        if(!filter)
            filter = {};
        const posts = await postsCollection.find(filter,
            {
                skip: (searchParams.pageNumber - 1) * searchParams.pageSize,
                limit: searchParams.pageSize,
                sort: [[searchParams.sortBy, searchParams.sortDirection]]
            }).project({
                _id: 0,
                id: 1,
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1
            }).toArray();
        const postsCount = await postsCollection.countDocuments(filter);
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
        return postsCollection.find().project({
            _id: 0,
            id: 1,
            title: 1,
            shortDescription: 1,
            content: 1,
            blogId: 1,
            blogName: 1,
            createdAt: 1
        }).toArray();
    },
    async findPostById(id: string) {
        return postsCollection.findOne({id: id}, {projection: {
                _id: 0,
                id: 1,
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1
            }});
    },
    async getUsersWithQueryParam(searchParams: QueryParamsModel) {
        const users = await usersCollection.find({$or:
                [
                    {login: {$regex: searchParams.searchLoginTerm, $options: 'i'}},
                    {email: {$regex: searchParams.searchEmailTerm, $options: 'i'}}
                ]
            },
            {
                skip: (searchParams.pageNumber - 1) * searchParams.pageSize,
                limit: searchParams.pageSize,
                sort: [[searchParams.sortBy, searchParams.sortDirection]]
            }).project({
            _id: 0,
            id: 1,
            login: 1,
            email: 1,
            createdAt: 1
            }).toArray();
        const usersCount = await usersCollection.countDocuments({$or:
                [
                    {login: {$regex: searchParams.searchLoginTerm, $options: 'i'}},
                    {email: {$regex: searchParams.searchEmailTerm, $options: 'i'}}
                ]
        });
        return {
            pagesCount: Math.ceil(usersCount / searchParams.pageSize),
            page: searchParams.pageNumber,
            pageSize: searchParams.pageSize,
            totalCount: usersCount,
            items: users.map(user => ({
                id: user.id,
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            }))
        }
    },
    async findUserById(id: string): Promise<UserViewModel | null> {
        return usersCollection.findOne({id: id}, {projection: {
                _id: 0,
                id: 1,
                login: 1,
                email: 1,
                createdAt: 1
            }});
    },
    async findAuthUserById(id: string) {
        const foundUser = await usersCollection.findOne({id: id}, {projection: {
                _id: 0,
                id: 1,
                login: 1,
                email: 1
            }});
        return foundUser ? {
            email: foundUser.email,
            login: foundUser.login,
            userId: foundUser.id
        } : null
    },
    async findCommentById(id: string): Promise<CommentsViewModel | null> {
        return commentsCollection.findOne({id: id}, {projection:{
                _id: 0,
                id: 1,
                content: 1,
                userId: 1,
                userLogin: 1,
                createdAt: 1
            }});
    },
    async getCommentsWithQueryParam(searchParams: QueryParamsModel, filter?: FilterType) {
        if(!filter)
            filter = {};
        const comments = await commentsCollection.find(filter,
            {
                skip: (searchParams.pageNumber - 1) * searchParams.pageSize,
                limit: searchParams.pageSize,
                sort: [[searchParams.sortBy, searchParams.sortDirection]]
            }).project({
            _id: 0,
            id: 1,
            content: 1,
            userId: 1,
            userLogin: 1,
            createdAt: 1
        }).toArray();
        const commentsCount = await commentsCollection.countDocuments(filter);
        return {
            pagesCount: Math.ceil(commentsCount / searchParams.pageSize),
            page: searchParams.pageNumber,
            pageSize: searchParams.pageSize,
            totalCount: commentsCount,
            items: comments.map(comment => ({
                id: comment.id,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                createdAt: comment.createdAt
            }))
        }
    }
};