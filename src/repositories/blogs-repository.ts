import {blogsCollection, BlogsType} from "./db";
import {searchParamsBlogs} from "../middlewares/input-validation-middleware";
import {SortDirection} from "mongodb";

export const blogsRepository = {       //объект с методами управления данными
    async returnAllBlogs () {
        return blogsCollection.find().project({_id: 0}).toArray();
    },
    async findBlogById(id: string): Promise<BlogsType | null> {
        return blogsCollection.findOne({id: id}, {projection:{_id:0}})  //object || undefined
    },
    async deleteBlogByTd(id: string) {
        return (await blogsCollection.deleteOne({id: id})).deletedCount === 1;
    },
    async createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: String((new Date()).valueOf()),
            name: name,
            description: description,
            websiteUrl: websiteUrl,
            createdAt: new Date().toISOString()
        };
        await blogsCollection.insertOne({...newBlog}); //передать в функцию сами поля, без создания объекта, переделать ретурн как в файлике фикс айди
        return newBlog; //blogsCollection.findOne({id: newBlog.id}, {projection:{_id:0}});
    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        return (await blogsCollection.updateOne({id: id}, { $set: {
                name: name,
                description: description,
                websiteUrl: websiteUrl
            }})).matchedCount === 1;
    },
    async allBlogsDelete() {
        await blogsCollection.deleteMany({})
    },
    async getBlogsWithQueryParam(searchParams: searchParamsBlogs) {
        let sortDirection: SortDirection = 1;
        if(searchParams.sortDirection === 'desc')
            sortDirection = -1;
        const blogs = await blogsCollection.find({name: { $regex:  searchParams.searchNameTerm, $options: 'i'}},
            {
                skip: (searchParams.pageNumber - 1) * searchParams.pageSize,
                limit: searchParams.pageSize,
                sort: [[searchParams.sortBy, sortDirection]]
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
    }
}