type BlogsType = {
    id: number;
    name: string;
    description: string;
    websiteUrl: string;
};
type BlogsRepositoryType = {
    blogs: BlogsType[];
};
const blogsRepositoryDb: BlogsRepositoryType = {
    blogs: []
};

export const blogsRepository = {       //объект с методами управления данными
    returnAllBlogs() {
        return blogsRepositoryDb.blogs;
    },
    findBlogById(id: number) {
        return blogsRepositoryDb.blogs.find(b => b.id === id); //array || undefined
    },
    deleteBlogByTd(id: number) {
        for(let i = 0; i < blogsRepositoryDb.blogs.length; i++) {
            if(blogsRepositoryDb.blogs[i].id === id) {
                blogsRepositoryDb.blogs.splice(i, 1);
                return true;
            }
        }
        return false
    },
    createBlog(name: string, description: string, websiteUrl: string) {
        const newBlog = {
            id: Number(new Date()),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        };
        blogsRepositoryDb.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id: number, name: string, description: string, websiteUrl: string) {
        const foundBlogsUpdate = blogsRepositoryDb.blogs.find(b => b.id === id);
        if(foundBlogsUpdate) {
            foundBlogsUpdate.name = name;
            foundBlogsUpdate.description = description;
            foundBlogsUpdate.websiteUrl = websiteUrl;
            return true;
        }
        else {
            return false;
        }
    }
}