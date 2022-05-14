// const Category = require("./app/models/category.model");
// const Brand = require("./app/models/brand.model");

const Product = require("./app/models/product.model");
const Review = require("./app/models/review.model");
const User = require("./app/models/user.model");
const mongoose = require("mongoose");
const express = require("express"),
  router = express.Router();
const Schema = mongoose.Schema;

// const old_brand = mongoose.model("old_brand", old_brandSchema, "old_brands");

// router.get("/fix-brand-images", async (_, res, next) => {
//   const brands = await Brand.find({});

//   try {
//     for await (const brand of brands) {
//       const oldbrand = await old_brand.findOne({
//         $or: [
//           { url: { $regex: brand.slug, $options: "i" } },
//           { title: { $regex: brand.title, $options: "i" } },
//         ],
//       });

//       if (oldbrand) {
//         // const image = fs.readFileSync("./files/old/medium/" + oldbrand.logo);

//         // console.log(image);
//         if (oldbrand.logo) {
//           brand.image = UploadService.singleUpload({
//             filepath: "./files/old/medium/" + oldbrand.logo,
//           });
//         }

//         // const headerImage = fs.readFileSync(
//         //   "./files/old/medium/" + oldbrand.image
//         // );
//         if (oldbrand.image) {
//           brand.headerImage = UploadService.singleUpload(
//             { filepath: "./files/old/medium/" + oldbrand.image },
//             [250, 54],
//             [500, 108],
//             [1000, 217]
//           );
//         }

//         await brand.save();
//       }
//     }
//   } catch (err) {
//     // throw err;
//     next(err);
//   }

//   res.send("hello brands");
// });

const old_contentSchema = new Schema({}, { strict: false });
const old_content = mongoose.model(
  "old_content",
  old_contentSchema,
  "old_contents"
);

// router.get("/fix-category-images", async (_, res, next) => {
//   const categorys = await Category.find({});

//   try {
//     for await (const category of categorys) {
//       const oldcategory = await old_content.findOne({
//         $or: [
//           { url: { $regex: category.slug, $options: "i" } },
//           { title2: { $regex: category.title, $options: "i" } },
//         ],
//       });

//       // if (!oldcategory) {
//       //   console.log(category.title);
//       // }

//       if (oldcategory) {
//         // const image = fs.readFileSync("./files/old/medium/" + oldcategory.logo);

//         // console.log(image);
//         if (oldcategory.logo) {
//           category.image = UploadService.singleUpload({
//             filepath: "./files/old/medium/" + oldcategory.logo,
//           });
//         }

//         if (oldcategory.image) {
//           category.icon = UploadService.singleUpload(
//             {
//               filepath: "./files/old/medium/" + oldcategory.image,
//             },
//             [50, 50],
//             [300, 396],
//             [800, 800]
//           );
//         }

//         if (oldcategory.image2) {
//           category.headerImage = UploadService.singleUpload(
//             {
//               filepath: "./files/old/medium/" + oldcategory.image2,
//             },
//             [250, 54],
//             [500, 108],
//             [1000, 217]
//           );
//         }

//         await category.save();
//       }
//     }
//   } catch (err) {
//     // throw err;
//     next(err);
//   }

//   res.send("hello brands");
// });

// router.get("/fix-product-images", async (_, res, next) => {
//   const products = await Product.find({});

//   try {
//     for await (const product of products) {
//       const oldproduct = await old_content.findOne({
//         $or: [
//           { url: { $regex: product.slug, $options: "i" } },
//           { title2: { $regex: product.title, $options: "i" } },
//         ],
//       });

//       if (oldproduct && oldproduct.image) {
//         try {
//           const path = UploadService.singleUpload({
//             filepath: "./files/old/convert/medium/" + oldproduct.image,
//             originalFilename: product.title,
//           });

//           if (path) {
//             product.image = {
//               fileName: path,
//               alt: product.title,
//             };
//           }

//           await product.save();
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     }
//   } catch (err) {
//     next(err);
//   }

//   res.send("hello brands");
// });

router.get("/fix-category", async (_, res) => {
  // const category = await Category.find({
  //   level: 1,
  //   parentId: { $exists: true },
  // });

  // const category2 = await Category.aggregate([
  //   {
  //     $match: {
  //       level: 2,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "categories",
  //       localField: "parentId",
  //       foreignField: "_id",
  //       pipeline: [
  //         {
  //           $match: {
  //             level: 1,
  //           },
  //         },
  //       ],
  //       as: "category",
  //     },
  //   },
  //   {
  //     $match: {
  //       category: {
  //         $exists: true,
  //         $size: 0,
  //       },
  //     },
  //   },
  // ]);

  // const category3 = await Category.aggregate([
  //   {
  //     $match: {
  //       level: 3,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "categories",
  //       localField: "parentId",
  //       foreignField: "_id",
  //       pipeline: [
  //         {
  //           $match: {
  //             level: 2,
  //           },
  //         },
  //       ],
  //       as: "category",
  //     },
  //   },
  //   {
  //     $match: {
  //       category: {
  //         $exists: true,
  //         $size: 0,
  //       },
  //     },
  //   },
  // ]);

  // console.log("category");
  // console.log(category);
  // console.log("category2");
  // console.log(category2);
  // console.log("category3");
  // console.log(category3);

  res.send("hello categories");
});

// router.get("/fix-brand", async (_, res) => {
//   const brands = await Brand.find().populate("categories._id");

//   for await (const brand of brands) {
//     let cats = [...brand.categories];
//     for await (const cat of cats) {
//       if (cat._id.level === 2) {()
//         cats = cats.filter((element) => {
//           return (
//             element._id._id.toString() !== cat._id._id.toString() &&
//             element._id._id.toString() !== cat._id.parentId.toString()
//           );
//         });
//       }
//     }
//     if (cats.length !== 0) {
//       console.log(cats);
//       console.log(brand);
//     }
//   }

//   res.send("hello brands");
// });

router.get("/move-review", async (_, res) => {
  const old_contents = await old_content
    .find({
      type: "12",
      status: "1",
      deleted_at: null,
      description: { $ne: null },
    })
    .lean();

  for await (const olc of old_contents) {
    const comment_parent = await old_content.findOne({
      id: olc.comment_parent,
    });

    let user;

    if (olc.user_id) {
      user = await User.find({
        email: olc.title2,
      });
    }

    if (+comment_parent?.type !== 6) {
      res.write("not product \n");
      res.write("" + olc.id + " \n");
      res.write("not product \n");
    }

    if (
      +comment_parent?.type === 6 &&
      comment_parent.url &&
      comment_parent.title
    ) {
      const pr = await Product.findOne({
        $or: [
          { slug: { $regex: comment_parent.url, $options: "i" } },
          { title: { $regex: comment_parent.title2, $options: "i" } },
        ],
      });

      if (pr && olc.title) {
        const rw = await Review.findOne({
          content: olc.description,
          name: olc.title,
          star: olc.rating,
          onModel: "product",
          modelId: pr._id,
        });

        if (rw) {
          // console.log(old_contents.id);
        } else {
          const review = new Review();
          review.content = olc.description;
          review.name = olc.title;

          if (olc.title2) {
            review.email = olc.title2;
          } else {
            review.email = "fat@gmail.com";
          }
          review.star = olc.rating;
          review.onModel = "product";
          review.status = "accepted";
          review.modelId = pr._id;
          review.createdAt = new Date(olc.created_at);
          review.updatedAt = new Date(olc.updated_at);

          if (user) {
            review.userId = user._id;
          }

          if (olc.author) {
            review.title = olc.author;
          }

          await review.save();
        }
      } else {
        res.write("no product \n");

        res.write("" + olc.id + " \n");
        res.write("no product \n");
      }
    } else {
      res.write("no comment parent \n");
      res.write("" + olc.id + " \n");
      res.write("no comment parent \n");
    }
  }

  res.write(" \n \n \n \nhello brands");
  res.end();
});

// const old_userSchema = new Schema({}, { strict: false });
// const old_user = mongoose.model("old_user", old_userSchema, "old_users");

// router.get("/move-users", async (_, res) => {
//   const oldus = await old_user.find();

//   for await (const oldu of oldus) {
//     const user = new User();
//     user.email = oldu.email;
//     user.name = oldu.name;
//     user.createdAt = new Date(oldu.created_at);
//     user.updatedAt = new Date(oldu.updated_at);

//     await user.save();
//   }

//   res.send("hello brands");
// });

// router.get("/fix-slug", async (_, res) => {
//   const brands = Brand.find();

//   for await (const brand of brands) {
//     brand.slug = string_to_slug(brand.title) + "-reviews";
//     await brand.save();
//   }
//   const products = Product.find().populate("categoryId").populate("brandId");

//   for await (const product of products) {
//     product.slug = product.categoryId?.slug + "/" + product.brandId?.slug;
//     await product.save();
//   }

//   res.send("hello slug");
// });



const Comparison = require("./app/models/comparison.model");
const string_to_slug = require("./app/helpers/string_to_slug");

router.get("/comparison-slug-fix", async (_, res) => {
  const comparisons = await Comparison.find({})
    .populate("compare1Id")
    .populate("compare2Id");

  for await (const comparison of comparisons) {
    if (comparison.onModel === "brand") {
      comparison.slug =
        comparison.compare1Id.slug + "-vs-" + comparison.compare2Id.slug;
    } else if (comparison.onModel === "product") {
      comparison.slug =
        string_to_slug(comparison.compare1Id.title) +
        "-vs-" +
        string_to_slug(comparison.compare2Id.title);
    }

    await comparison.save();
  }

  res.send("ldf");
});