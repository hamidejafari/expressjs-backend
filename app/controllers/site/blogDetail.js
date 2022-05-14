const Category = require("../../models/category.model");
const Blog = require("../../models/blog.model");
const Review = require("../../models/review.model");
const BlogCategory = require("../../models/blogCategory.model");
const Redirect = require("../../models/redirect.model");

// const Brand = require("../../models/brand.model");

const blogDetail = async (req, res, next) => {
  try {

    const blog = await Blog.findOne({ slug: req.params.slug}).populate("blogCategoryId");
    const blogCategory = await BlogCategory.findOne({ slug: req.params.slug});
    let redirect;

    if (!blog &&  !blogCategory) {
      redirect = await Redirect.findOne({
        oldAddress: "blog/" + req.params.slug,
      });
      return res.status(200).json({
        redirect: redirect,
      });
    }

    if(blog){

      let category;
      let reviews;
      let reviewsCount;
      let relatedBlogs;
      
      if(blog){
          blog.views = blog.views+1;
          await blog.save();
  
          reviews = await Review.find({ onModal:"blog", modelId: blog._id, status:"accepted"}).limit(10);
          reviewsCount = await Review.find({ onModal:"blog", modelId: blog._id, status:"accepted"}).count();
          category = await Category.findOne({ _id: blog.categoryId }).populate("brands._id");
          relatedBlogs = await Blog.find({ blogCategoryId:blog.blogCategoryId }).populate("blogCategoryId");
          
      }
  
      res.status(200).json({
          blog: blog,
          category: category,
          reviews: reviews,
          reviewsCount: reviewsCount,
          relatedBlogs: relatedBlogs,
          type:'blog'
      });

    }

    if(blogCategory){
      let category;
      let blogs;
      let redirect;
      if(!blogCategory){
        redirect = await Redirect.findOne({oldAddress:"blog/"+req.params.slug});
        return res.status(200).json({
          redirect: redirect
        });
      }else{
        category = await Category.findOne({ _id: blogCategory.categoryId }).populate("brands._id");
        blogs = await Blog.find({ blogCategoryId: blogCategory._id });    
      }


      res.status(200).json({
          blogCategory: blogCategory,
          category: category,
          blogs: blogs,
          type:'category'
      });
    }

    if(!blog && !blogCategory){
      res.status(200).json({});
    }

  } catch (err) {
    next(err);
  }
};

module.exports = blogDetail;