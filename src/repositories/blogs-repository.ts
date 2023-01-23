import {DataBase} from "./dataBase";
import {inject, injectable} from "inversify";
import {BlogModel} from "../domain/mongoose-schemas/blog-schema";
import {HydratedDocument} from 'mongoose';
import {BlogModelType, BlogsCollectionType} from "../domain/mongoose-types/blog-schema-types";

@injectable()
export class BlogsRepository { //объект с методами управления данными
    constructor(@inject(DataBase) protected db: DataBase) { };
    async findById(id: string): Promise<HydratedDocument<BlogsCollectionType, BlogModelType> | null> {
        return BlogModel.findOne({id: id});
    };
    async deleteByTd(id: string): Promise<boolean> {
        return (await BlogModel.deleteOne({id: id}).exec()).deletedCount === 1;
    };
    async deleteAll(): Promise<boolean> {
        return (await BlogModel.deleteMany().exec()).acknowledged;
    };
    async save(blog: HydratedDocument<BlogsCollectionType, BlogModelType>): Promise<boolean> {
        return !!(await blog.save());
    }
}