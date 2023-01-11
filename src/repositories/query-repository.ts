import {BlogModel, CommentModel, PostModel, UserModel} from "./db";
import {BlogsViewType} from "../types/view-model-types/blogs-view-type";
import {UserViewType} from "../types/view-model-types/user-view-type";
import {CommentsViewType} from "../types/view-model-types/comments-view-type";
import {QueryParamsType} from "../types/query-params-type";
import {FilterQueryType} from "../types/filter-query-type";

export const queryRepository = {
    async getBlogsWithQueryParam(searchParams: QueryParamsType) {
        const blogs = await BlogModel.find({name: { $regex:  searchParams.searchNameTerm, $options: 'i'}})
            .skip((searchParams.pageNumber - 1) * searchParams.pageSize,)
            .limit(searchParams.pageSize)
            .sort([[searchParams.sortBy, searchParams.sortDirection]])
            .select({
                _id: 0,
                id: 1,
                name: 1,
                description: 1,
                websiteUrl: 1,
                createdAt: 1
            }).exec();
        const blogsCount = await BlogModel.countDocuments()
            .where('name').regex(new RegExp(searchParams.searchNameTerm, 'i')).exec();
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
    async findBlogById(id: string): Promise<BlogsViewType | null> {
        return await BlogModel.findOne({id: id}).select({
            _id: 0,
            id: 1,
            name: 1,
            description: 1,
            websiteUrl: 1,
            createdAt: 1
        }).exec();
    },
    async getPotsWithQueryParam(searchParams: QueryParamsType, filter?: FilterQueryType) {
        if(!filter)
            filter = {};
        const posts = await PostModel.find(filter)
            .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
            .limit(searchParams.pageSize)
            .sort([[searchParams.sortBy, searchParams.sortDirection]])
            .select({
                _id: 0,
                id: 1,
                title: 1,
                shortDescription: 1,
                content: 1,
                blogId: 1,
                blogName: 1,
                createdAt: 1
            }).exec();
        const postsCount = await PostModel.countDocuments(filter).exec();
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
    async findPostById(id: string) {
        return await PostModel.findOne({id: id}).select({
            _id: 0,
            id: 1,
            title: 1,
            shortDescription: 1,
            content: 1,
            blogId: 1,
            blogName: 1,
            createdAt: 1
        }).exec();
    },
    async getUsersWithQueryParam(searchParams: QueryParamsType) {
        const users = await UserModel.find().or([
                {'accountData.login': {$regex: searchParams.searchLoginTerm, $options: 'i'}},
                {'accountData.email': {$regex: searchParams.searchEmailTerm, $options: 'i'}}
            ])
            .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
            .limit(searchParams.pageSize)
            .sort([[searchParams.sortBy, searchParams.sortDirection]])
            .select({
                _id: 0,
                id: 1,
                'accountData.login': 1,
                'accountData.email': 1,
                'accountData.createdAt': 1
            }).exec();
        const usersCount = await UserModel.countDocuments().or([
            {'accountData.login': {$regex: searchParams.searchLoginTerm, $options: 'i'}},
            {'accountData.email': {$regex: searchParams.searchEmailTerm, $options: 'i'}}
        ]).exec();
        return {
            pagesCount: Math.ceil(usersCount / searchParams.pageSize),
            page: searchParams.pageNumber,
            pageSize: searchParams.pageSize,
            totalCount: usersCount,
            items: users.map(user => ({
                id: user.id,
                login: user.accountData.login,
                email: user.accountData.email,
                createdAt: user.accountData.createdAt
            }))
        };
    },
    async findUserById(id: string): Promise<UserViewType | null> {
        const user = await UserModel.findOne({id: id}).select({
            _id: 0,
            id: 1,
            'accountData.login': 1,
            'accountData.email': 1,
            'accountData.createdAt': 1
        }).exec();
        return user ? {
            id: user.id,
            login: user.accountData.login,
            email: user.accountData.email,
            createdAt: user.accountData.createdAt
        } : null;
    },
    async findCommentById(id: string, userId?: string): Promise<CommentsViewType | null> {
        const comment = await CommentModel.findOne({id: id}).populate('reactions').select({_id: 0, __v: 0}).exec();
        let myStatus: string = 'None';
        let likesCount: number = 0;
        let dislikesCount: number = 0;
        if(!comment)
            return null;
        if(comment.reactions.length > 0) {
            if (userId) {
                comment.reactions.forEach(r => {
                    if (r.userId === userId)
                        myStatus = r.reaction;
                });
            }
            comment.reactions.forEach(r => {
                if (r.reaction === "Like")
                    likesCount++;
                else dislikesCount++;
            });
        }
        return {
            id: comment.id,
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: likesCount,
                dislikesCount: dislikesCount,
                myStatus: myStatus
            }
        }

    },
    async getCommentsWithQueryParam(searchParams: QueryParamsType, filter?: FilterQueryType, userId?: string) {
        if(!filter)
            filter = {};
        const comments = await CommentModel.find(filter)
            .populate('reactions')
            .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
            .limit(searchParams.pageSize)
            .sort([[searchParams.sortBy, searchParams.sortDirection]])
            .select({_id: 0, __v: 0}).exec();
        const commentsCount = await CommentModel.countDocuments(filter).exec();

        return {
            pagesCount: Math.ceil(commentsCount / searchParams.pageSize),
            page: searchParams.pageNumber,
            pageSize: searchParams.pageSize,
            totalCount: commentsCount,
            items: comments.map(comment => {
                let myStatus: string = 'None';
                let likesCount: number = 0;
                let dislikesCount: number = 0;
                if(comment.reactions.length > 0) {
                    if (userId) {
                        comment.reactions.forEach(r => {
                            if (r.userId === userId)
                                myStatus = r.reaction;
                        });
                    }
                    comment.reactions.forEach(r => {
                        if (r.reaction === "Like")
                            likesCount++;
                        else dislikesCount++;
                    });
                }
                return {
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    createdAt: comment.createdAt,
                    likesInfo: {
                        likesCount: likesCount,
                        dislikesCount: dislikesCount,
                        myStatus: myStatus
                    }
                }
            })
        }
    }
};