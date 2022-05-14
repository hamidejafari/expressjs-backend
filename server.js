const env = require("dotenv");
const mongoose = require("mongoose");

const categoryRoutes = require("./app/routes/category.routes");
const brandRoutes = require("./app/routes/brand.routes");
const userRoutes = require("./app/routes/user.routes");
const productRoutes = require("./app/routes/product.routes");
const roleRoutes = require("./app/routes/role.routes");
const logRoutes = require("./app/routes/log.routes");
const flagRoutes = require("./app/routes/flag.routes");
const blogCategoryRoutes = require("./app/routes/blogCategory.routes");
const blogRoutes = require("./app/routes/blog.routes");
const comparisonRoutes = require("./app/routes/comparison.routes");
const reviewRoutes = require("./app/routes/review.routes");
const tagRoutes = require("./app/routes/tag.routes");
const couponRoutes = require("./app/routes/coupon.routes");
const controlRoutes = require("./app/routes/control.routes");
const redirectRoutes = require("./app/routes/redirect.routes");
const siteRoutes = require("./app/routes/site.routes");
const appRoutes = require("./app/routes/app.routes");
const settingRoutes = require("./app/routes/setting.routes");
const contactUsRoutes = require("./app/routes/contactUs.routes");
const brandComparisonCategoryRoutes = require("./app/routes/brandComparisonCategory.routes");
const searchHistoryRoutes = require("./app/routes/searchHistory.routes");
const bannerRoutes = require("./app/routes/banner.routes");
const businessRoutes = require("./app/routes/business.routes");
const businessBrandRoutes = require("./app/routes/businessBrand.routes");
const businessProductRoutes = require("./app/routes/businessProduct.routes");

env.config();
const express = require("express");
const cors = require("cors");

const { formidable } = require("formidable");

const purificationBodyMiddleware = require("./app/middleware/purificationBody");

const app = express();

app.use(cors());
app.use(
  "/files",
  express.static("files", {
    setHeaders: function (res) {
      res.set("Cache-Control", "public, max-age=31536000, immutable");
    },
  })
);

app.use((req, res, next) => {
  const form = formidable({ multiples: true });

  form.parse(req, async function (err, fields, files) {
    try {
      if (err) {
        throw err;
      }
      req.body = fields;
      req.files = files;
      next();
    } catch (err) {
      next(err);
    }
  });
});

const categorySitemap = require("./app/services/sitemap/categorySitemap");
const brandSitemap = require("./app/services/sitemap/brandSitemap");
const productSitemap = require("./app/services/sitemap/productSitemap");
const imageSitemap = require("./app/services/sitemap/imageSitemap");
const comparisonSitemap = require("./app/services/sitemap/comparisonSitemap");
const blogSitemap = require("./app/services/sitemap/blogSitemap");
const tagSitemap = require("./app/services/sitemap/tagSitemap");
// const Product = require("./app/models/product.model");
// const Brand = require("./app/models/brand.model");
// const Category = require("./app/models/category.model");
// const Blog = require("./app/models/blog.model");
// const BlogCategory = require("./app/models/blogCategory.model");
// const Review = require("./app/models/review.model");

app.get("/sitemap-create-nqN2GXKF2qeZhtFB", async (_, res) => {
  Promise.all([
    tagSitemap(),
    categorySitemap(),
    brandSitemap(),
    productSitemap(),
    imageSitemap(),
    comparisonSitemap(),
    blogSitemap(),
  ]).then(() => {
    res.send("ok");
  });
});

app.use(
  "/api",
  purificationBodyMiddleware,
  categoryRoutes,
  userRoutes,
  brandRoutes,
  productRoutes,
  roleRoutes,
  logRoutes,
  flagRoutes,
  blogCategoryRoutes,
  comparisonRoutes,
  blogRoutes,
  couponRoutes,
  reviewRoutes,
  controlRoutes,
  redirectRoutes,
  siteRoutes,
  appRoutes,
  brandComparisonCategoryRoutes,
  searchHistoryRoutes,
  contactUsRoutes,
  bannerRoutes,
  settingRoutes,
  businessBrandRoutes,
  businessProductRoutes,
  tagRoutes,
  businessRoutes
);

app.get("/", (_, res) => {
  res.send("hello brands");
});

// eslint-disable-next-line no-unused-vars
app.use((err, _, res, __) => {
  const errorObjc = {};
  if (err.error) {
    errorObjc.error = err.error;
  } else {
    errorObjc.message = err.message || "Some error occurred";
  }
  return res.status(err.code || 500).send(errorObjc);
});

app.use((_, res) => {
  return res.status(404).send("404 not found");
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, function () {
      console.log("listening on " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.log("Could not connect to the database. Exiting now...", err);
    process.exit();
  });
