const BlogCategory = require("../../models/blogCategory.model");
const Category = require("../../models/category.model");
const Blog = require("../../models/blog.model");
const Redirect = require("../../models/redirect.model");

// const Brand = require("../../models/brand.model");

const blogCategoryDetail = async (req, res, next) => {
  try {

    const blogCategory = await BlogCategory.findOne({ slug: req.params.slug});
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
        blogs: blogs
    });
  } catch (err) {
    next(err);
  }
};

module.exports = blogCategoryDetail;