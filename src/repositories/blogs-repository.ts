import {DataBase} from "./dataBase";
import {BlogUpdateType} from "../types/update-model-types/blog-update-type";
import {BlogCreateType} from "../types/create-model-types/blog-create-type";
import {BlogsViewType} from "../types/view-model-types/blogs-view-type";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsRepository { //объект с методами управления данными
    constructor(@inject(DataBase) protected db: DataBase) { };
    async findById(id: string): Promise<BlogsViewType | null> {
        return await this.db.BlogModel.findOne({id: id}).select({
            _id: 0,
            id: 1,
            name: 1,
            description: 1,
            websiteUrl: 1,
            createdAt: 1
        }).exec();
    };
    async deleteByTd(id: string): Promise<boolean> {
        return (await this.db.BlogModel.deleteOne({id: id}).exec()).deletedCount === 1;
    };
    async create(newBlog: BlogCreateType): Promise<boolean> {
        try {
            await this.db.BlogModel.create(newBlog);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    };
    async update(updateBlog: BlogUpdateType): Promise<boolean> {
        return (await this.db.BlogModel.updateOne({id: updateBlog.id}, {
            name: updateBlog.name,
            description: updateBlog.description,
            websiteUrl: updateBlog.websiteUrl
        }).exec()).matchedCount === 1;
    };
    async deleteAll(): Promise<boolean> {
        return (await this.db.BlogModel.deleteMany().exec()).acknowledged;
    };
}