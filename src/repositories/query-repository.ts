import {blogsCollection, commentsCollection, postsCollection, usersCollection} from "./db";
import {SearchParamsModel} from "../models/search-params-model";
import {QueryInputParamsModel} from "../models/query-input-params-model";
import {SortDirection} from "mongodb";
import {BlogsViewModel} from "../models/blogs-view-model";
import {QueryUsersInputParamsModel} from "../models/query-users-input-params-model";
import {SearchUsersParamsModel} from "../models/search-users-params-model";
import {UserViewModel} from "../models/user-view-model";
import {CommentsViewModel} from "../models/comments-view-model";
export const queryRepository = {
    queryParamsValidation(queryParams: QueryInputParamsModel): SearchParamsModel {
        const searchNameTerm = queryParams.searchNameTerm || '';
        const pageNumber = queryParams.pageNumber || 1;
        const pageSize = queryParams.pageSize || 10;
        const sortBy = queryParams.sortBy || 'createdAt';
        let sortDirection: SortDirection = 'desc';
        if(String(queryParams.sortDirection) === 'asc')
            sortDirection = 'asc';
        return {
            searchNameTerm: String(searchNameTerm),
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
            sortBy: String(sortBy),
            sortDirection: sortDirection
        };
    },
    queryUsersParamsValidation(queryUsersParams: QueryUsersInputParamsModel): SearchUsersParamsModel {
        const searchLoginTerm = queryUsersParams.searchLoginTerm || '';
        const searchEmailTerm = queryUsersParams.searchEmailTerm || '';
        const pageNumber = queryUsersParams.pageNumber || 1;
        const pageSize = queryUsersParams.pageSize || 10;
        const sortBy = queryUsersParams.sortBy || 'createdAt';
        let sortDirection: SortDirection = 'desc';
        if(String(queryUsersParams.sortDirection) === 'asc')
            sortDirection = 'asc';
        return {
            searchLoginTerm: String(searchLoginTerm),
            searchEmailTerm: String(searchEmailTerm),
            pageNumber: Number(pageNumber),
            pageSize: Number(pageSize),
            sortBy: String(sortBy),
            sortDirection: sortDirection
        };
    },
    async getBlogsWithQueryParam(queryParams: QueryInputParamsModel) {
        const searchParams = this.queryParamsValidation(queryParams);
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
    async returnAllBlogs () {
        return blogsCollection.find().project({
            _id: 0,
            id: 1,
            name: 1,
            description: 1,
            websiteUrl: 1,
            createdAt: 1
        }).toArray();
    },
    async getPotsWithQueryParamAndBlogId(queryParams: QueryInputParamsModel, blogId: string) {
        const searchParams = this.queryParamsValidation(queryParams);
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
    async getPotsWithQueryParam(queryParams: QueryInputParamsModel) {
        const searchParams = this.queryParamsValidation(queryParams);
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
    async getUsersWithQueryParam(queryUsersParams: QueryUsersInputParamsModel) {
        const searchParams = this.queryUsersParamsValidation(queryUsersParams);
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
            }).project({_id: 0}).toArray();
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
    }
};