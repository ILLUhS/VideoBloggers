import {DataBase} from "./dataBase";
import {BlogsViewType} from "../types/view-model-types/blogs-view-type";
import {UserViewType} from "../types/view-model-types/user-view-type";
import {CommentsViewType} from "../types/view-model-types/comments-view-type";
import {QueryParamsType} from "../types/query-params-type";
import {FilterQueryType} from "../types/filter-query-type";
import {ReactionsCollectionType} from "../types/collection-types/reactions-collection-type";

export class QueryRepository {
    constructor(protected db: DataBase) { };
    async getBlogsWithQueryParam(searchParams: QueryParamsType) {
        const blogs = await this.db.BlogModel.find({name: { $regex:  searchParams.searchNameTerm, $options: 'i'}})
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
        const blogsCount = await this.db.BlogModel.countDocuments()
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
    };
    async findBlogById(id: string): Promise<BlogsViewType | null> {
        return await this.db.BlogModel.findOne({id: id}).select({
            _id: 0,
            id: 1,
            name: 1,
            description: 1,
            websiteUrl: 1,
            createdAt: 1
        }).exec();
    };
    async getPotsWithQueryParam(searchParams: QueryParamsType, filter?: FilterQueryType, userId?: string) {
        if(!filter)
            filter = {};
        const posts = await this.db.PostModel.find(filter)
            .populate('reactions')
            .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
            .limit(searchParams.pageSize)
            .sort([[searchParams.sortBy, searchParams.sortDirection]])
            .select({_id: 0, __v: 0}).exec();
        const postsCount = await this.db.PostModel.countDocuments(filter).exec();
        return {
            pagesCount: Math.ceil(postsCount / searchParams.pageSize),
            page: searchParams.pageNumber,
            pageSize: searchParams.pageSize,
            totalCount: postsCount,
            items: await Promise.all(posts.map(async post => {
                const likesInfoMapped = await this.likesInfoMap(post.reactions, userId);
                const newestLikesMapped = await this.newestLikesMap([...post.reactions]);
                return {
                    id: post.id,
                    title: post.title,
                    shortDescription: post.shortDescription,
                    content: post.content,
                    blogId: post.blogId,
                    blogName: post.blogName,
                    createdAt: post.createdAt,
                    extendedLikesInfo: {
                        likesCount: likesInfoMapped.likesCount,
                        dislikesCount: likesInfoMapped.dislikesCount,
                        myStatus: likesInfoMapped.myStatus,
                        newestLikes: newestLikesMapped
                    }
                }
            }))
        };
    };
    async findPostById(id: string, userId?: string) {
        const post = await this.db.PostModel.findOne({id: id}).populate('reactions').select({_id: 0, __v: 0}).exec();
        if(!post)
            return null;
        const likesInfoMapped = await this.likesInfoMap(post.reactions, userId);
        const newestLikesMapped = await this.newestLikesMap([...post.reactions]);
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: likesInfoMapped.likesCount,
                dislikesCount: likesInfoMapped.dislikesCount,
                myStatus: likesInfoMapped.myStatus,
                newestLikes: newestLikesMapped
            }
        };
    };
    async getUsersWithQueryParam(searchParams: QueryParamsType) {
        const users = await this.db.UserModel.find().or([
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
        const usersCount = await this.db.UserModel.countDocuments().or([
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
    };
    async findUserById(id: string): Promise<UserViewType | null> {
        const user = await this.db.UserModel.findOne({id: id}).select({
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
    };
    async findCommentById(id: string, userId?: string): Promise<CommentsViewType | null> {
        const comment = await this.db.CommentModel.findOne({id: id}).populate('reactions').select({_id: 0, __v: 0}).exec();
        if(!comment)
            return null;
        const likesInfoMapped = await this.likesInfoMap(comment.reactions, userId);
        return {
            id: comment.id,
            content: comment.content,
            userId: comment.userId,
            userLogin: comment.userLogin,
            createdAt: comment.createdAt,
            likesInfo: likesInfoMapped
        }
    };
    async getCommentsWithQueryParam(searchParams: QueryParamsType, filter?: FilterQueryType, userId?: string) {
        if(!filter)
            filter = {};
        const comments = await this.db.CommentModel.find(filter)
            .populate('reactions')
            .skip((searchParams.pageNumber - 1) * searchParams.pageSize)
            .limit(searchParams.pageSize)
            .sort([[searchParams.sortBy, searchParams.sortDirection]])
            .select({_id: 0, __v: 0}).exec();
        const commentsCount = await this.db.CommentModel.countDocuments(filter).exec();
        return {
            pagesCount: Math.ceil(commentsCount / searchParams.pageSize),
            page: searchParams.pageNumber,
            pageSize: searchParams.pageSize,
            totalCount: commentsCount,
            items: await Promise.all(comments.map(async comment => {
                const likesInfoMapped = await this.likesInfoMap(comment.reactions, userId);
                return {
                    id: comment.id,
                    content: comment.content,
                    userId: comment.userId,
                    userLogin: comment.userLogin,
                    createdAt: comment.createdAt,
                    likesInfo: likesInfoMapped
                }
            }))
        };
    };
    async likesInfoMap(reactions: ReactionsCollectionType[], userId?: string) {
        if(!userId)
            userId = '';
        let myStatus: string = 'None';
        let likesCount: number = 0;
        let dislikesCount: number = 0;
        if(reactions.length > 0) {
            reactions.forEach(r => {
                if (r.userId === userId)
                    myStatus = r.reaction;
                if (r.reaction === "Like")
                    likesCount++;
                else dislikesCount++;
            });
        }
        return {
            likesCount: likesCount,
            dislikesCount: dislikesCount,
            myStatus: myStatus
        }
    };
    async newestLikesMap(reactions: ReactionsCollectionType[]) {
        //фильтруем копию массива, оставляем только лайки, потом сортируем лайки по дате
        const newestLikes = reactions.filter(like => like.reaction === "Like")
            .sort(function(a, b) {
                if (a.createdAt > b.createdAt) {
                    return -1; }
                if (a.createdAt < b.createdAt) {
                    return 1; }
                return 0;
            });
        newestLikes.splice(3); //берем первые три лайка
        return newestLikes.map(like => ({
            addedAt: like.createdAt,
            userId: like.userId,
            login: like.login
        }))
    };
}