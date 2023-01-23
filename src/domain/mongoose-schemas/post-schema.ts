import mongoose from "mongoose";
import {PostModelType, PostsCollectionType} from "../mongoose-types/post-schema-types";
import {v4 as uuidv4} from "uuid";

export const postSchema = (new mongoose.Schema<PostsCollectionType, PostModelType>({
    id: mongoose.Schema.Types.String,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String
}, {toJSON: {virtuals: true}, toObject: {virtuals: true}}));
postSchema.static('makeInstance',
    function makeInstance(title: string, shortDescription: string,
                          content: string, blogId: string, blogName: string) {
    return new PostModel({
        id: uuidv4(),
        title: title,
        shortDescription: shortDescription,
        content: content,
        blogId: blogId,
        blogName: blogName,
        createdAt: new Date().toISOString()
    });
});
postSchema.method('updateProperties',
    function updateProperties(title: string, shortDescription: string,
                              content: string, blogId: string, blogName: string) {
    this.title = title;
    this.shortDescription = shortDescription;
    this.content = content;
    this.blogId = blogId;
    this.blogName = blogName;
});
postSchema.method('updateBlogName',
    function updateBlogName(blogName: string) {
        this.blogName = blogName;
});

export const PostModel = mongoose.model<PostsCollectionType, PostModelType>("posts", postSchema);