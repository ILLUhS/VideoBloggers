type BlogsType = {
    id: string;
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
    findBlogById(id: string) {
        return blogsRepositoryDb.blogs.find(b => b.id === id); //array || undefined
    },
    deleteBlogByTd(id: string) {
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
            id: String((new Date()).getMilliseconds()),
            name: name,
            description: description,
            websiteUrl: websiteUrl
        };
        blogsRepositoryDb.blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id: string, name: string, description: string, websiteUrl: string) {
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
    },
    allBlogsDelete() {
        blogsRepositoryDb.blogs = [];
    }
}