type BlogsType = {
    id: number;
    name: string;
    description: string;
    websiteUrl: string;
};
type BlogsRepositoryType = {
    blogs: BlogsType[];
};
const BlogsRepository: BlogsRepositoryType = {
    blogs: []
};

export const blogsRepository = {       //объект с методами управления данными
    returnAllBlogs() {
        return BlogsRepository.blogs;
    },
    findBlogById(id: number) {

    }
}