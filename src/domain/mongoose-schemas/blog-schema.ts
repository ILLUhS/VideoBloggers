import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";
import {BlogModelType, BlogsCollectionType} from "../mongoose-types/blog-schema-types";

export const blogSchema = new mongoose.Schema<BlogsCollectionType, BlogModelType>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true}
});
blogSchema.static('makeInstance', function makeInstance(name: string, description: string, websiteUrl: string) {
    return new BlogModel({
        id: uuidv4(),
        name: name,
        description: description,
        websiteUrl: websiteUrl,
        createdAt: new Date().toISOString()
    });
});
blogSchema.method('updateProperties', function updateProperties(name: string, description: string, websiteUrl: string) {
    this.name = name;
    this.description = description;
    this.websiteUrl = websiteUrl;
});

export const BlogModel = mongoose.model<BlogsCollectionType, BlogModelType>("blogs", blogSchema);