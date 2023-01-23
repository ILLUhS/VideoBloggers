import {DataBase} from "./dataBase";
import {inject, injectable} from "inversify";
import {HydratedDocument} from "mongoose";
import {PostModelType, PostsCollectionType} from "../domain/mongoose-types/post-schema-types";
import {PostModel} from "../domain/mongoose-schemas/post-schema";

@injectable()
export class PostsRepository {       //объект с методами управления данными
    constructor(@inject(DataBase) protected db: DataBase) { };
    async deleteByTd(id: string): Promise<boolean> {
        return (await this.db.PostModel.deleteOne({id: id}).exec()).deletedCount === 1;
    };
    async deleteAll(): Promise<boolean> {
        return (await this.db.PostModel.deleteMany().exec()).acknowledged;
    };
    async findById(id: string): Promise<HydratedDocument<PostsCollectionType, PostModelType> | null> {
        return PostModel.findOne({id: id});
    };
    async save(post: HydratedDocument<PostsCollectionType, PostModelType>): Promise<boolean> {
        return !!(await post.save());
    };
    async findPostsByBlogId(blogId: string): Promise<HydratedDocument<PostsCollectionType, PostModelType>[] | null> {
        return PostModel.find({blogId: blogId});
    };
}