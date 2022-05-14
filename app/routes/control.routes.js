const { default: axios } = require("axios");
const Brand = require("../models/brand.model");
const Control = require("../models/control.model");
const Redirect = require("../models/redirect.model");
const Product = require("../models/product.model");
const Category = require("../models/category.model");

const express = require("express"),
  router = express.Router();

//categories

router.get("/admin/controls-category/insert", async (_, res) => {
  axios.get("https://www.brandsreviews.com/control-cats").then((response) => {
    response?.data?.cats.forEach(async (cat) => {
      const newCat = await Category.findOne({
        $or: [
          { slug: { $regex: cat.slug, $options: "i" } },
          { title: { $regex: cat.title, $options: "i" } },
        ],
      });
      if (newCat) {
        const control = new Control({
          newTitle: newCat.title,
          newSlug: newCat.slug,
          oldTitle: cat.title,
          oldSlug: cat.slug,
          type: "category",
        });
        await control.save();
      } else {
        const control = new Control({
          oldTitle: cat.title,
          oldSlug: cat.slug,
          type: "category",
        });
        await control.save();
      }
    });
  });
  res.send("done");
});

router.get("/admin/control-categories", async (req, res, next) => {
  const perPage = +req.query.perPage || 50;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {};
    if (req.query.title) {
      query.$or = [
        { newTitle: { $regex: req.query.title, $options: "i" } },
        { newSlug: { $regex: req.query.title, $options: "i" } },
        { oldTitle: { $regex: req.query.title, $options: "i" } },
        { oldSlug: { $regex: req.query.title, $options: "i" } },
      ];
    }

    query.type = "category";

    const controls = await Control.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt");
    const count = await Control.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    const redControls = await Control.find({
      type: "category",
      newTitle: { $exists: 0 },
    }).count();
    const greenControls = await Control.find({
      type: "category",
      $where: "this.newSlug == this.oldSlug",
    });
    const brownControls = await Control.find({
      type: "category",
      $where: "this.newSlug != this.oldSlug",
    });

    res.status(200).json({
      data: {
        redControlsCount: redControls,
        greenControlsCount: greenControls.length,
        brownControlsCount: brownControls.length,
        controls: controls,
      },
      meta: { count, lastPage },
    });
  } catch (err) {
    next(err);
  }
});

router.get(
  "/admin/control-categories/redirect/:_id",
  async (req, res, next) => {
    try {
      const control = await Control.findOne({ _id: req.params._id });
      control.redirected = true;
      await control.save();

      const redirect = new Redirect({
        newAddress: control.newSlug,
        oldAddress: control.oldSlug,
      });

      await redirect.save();
      res.status(200).json(control);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/admin/control-categories/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

router.get("/admin/control-categories/check/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    const newCat = await Category.findOne({
      $or: [
        { slug: { $regex: control.oldSlug, $options: "i" } },
        { title: { $regex: control.oldTitle, $options: "i" } },
      ],
    });
    if (newCat) {
      control.newTitle = newCat.title;
      control.newSlug = newCat.slug;
      await control.save();
    }
    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

router.put("/admin/control-categories/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    control.newTitle = req.body.newTitle;
    control.newSlug = req.body.newSlug;
    await control.save();

    const category = await Category.findOne({
      $or: [
        { title: { $regex: control.newTitle, $options: "i" } },
        { slug: { $regex: control.newSlug, $options: "i" } },
      ],
    });
    category.slug = req.body.newSlug;
    category.title = req.body.newTitle;
    await category.save();

    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

//products

router.get("/admin/fix-control-productscheck", async (req, res) => {
  const greenControls = await Control.find({
    type: "product",
    $where: "this.newSlug == this.oldSlug",
  });
  for await (const productControl of greenControls) {
    const product = await Product.findOne({
      $or: [
        { title: { $regex: productControl.newTitle, $options: "i" } },
        { slug: { $regex: productControl.newSlug, $options: "i" } },
      ],
    });

    if (!product) {
      productControl.isNotFound = true;
      await productControl.save();
    }
  }
  res.status(200).json({ greenControls: greenControls });
});

router.get("/admin/fix-control-productsme", async (req, res) => {
  const greenControls = await Control.find({
    type: "product",
    $where: "this.newSlug == this.oldSlug",
  });
  for await (const productControl of greenControls) {
    const product = await Product.findOne({
      $or: [
        { title: { $regex: productControl.newTitle, $options: "i" } },
        { slug: { $regex: productControl.newSlug, $options: "i" } },
      ],
    });

    if (product) {
      if (product.slug !== productControl.newSlug) {
        product.slug = productControl.newSlug;
        await product.save();
      }
    }

    productControl.fixedHamide = true;
    await productControl.save();
  }
  res.status(200).json({ greenControls: greenControls });
});

router.get("/admin/fix-control-brand", async (req, res) => {
  const greenControls = await Control.find({
    type: "brand",
    $where: "this.newSlug == this.oldSlug",
    fixed2: { $ne: true },
  }).limit(100);

  greenControls.forEach(async (brandControl) => {
    const brand = await Brand.findOne({
      $or: [
        { title: { $regex: brandControl.newTitle, $options: "i" } },
        { slug: { $regex: brandControl.newSlug, $options: "i" } },
      ],
    });

    if (brand) {
      if (brand.slug !== brandControl.newSlug) {
        brand.slug = brandControl.newSlug;
        await brand.save();
      }
    }

    brandControl.fixed2 = true;
    await brandControl.save();
  });

  res.status(200).json({ greenControls: greenControls });
});

router.get("/admin/control-products", async (req, res, next) => {
  const perPage = +req.query.perPage || 50;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {};
    if (req.query.title) {
      query.$or = [
        { newTitle: { $regex: req.query.title, $options: "i" } },
        { newSlug: { $regex: req.query.title, $options: "i" } },
        { oldTitle: { $regex: req.query.title, $options: "i" } },
        { oldSlug: { $regex: req.query.title, $options: "i" } },
      ];
    }

    query.type = "product";

    const controls = await Control.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt");
    const count = await Control.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    const redControls = await Control.find({
      type: "product",
      newTitle: { $exists: 0 },
    }).count();
    const greenControls = await Control.find({
      type: "product",
      $where: "this.newSlug == this.oldSlug",
    });
    const brownControls = await Control.find({
      type: "product",
      $where: "this.newSlug != this.oldSlug",
    });

    res.status(200).json({
      data: {
        redControlsCount: redControls,
        greenControlsCount: greenControls.length,
        brownControlsCount: brownControls.length,
        controls: controls,
      },
      meta: { count, lastPage },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/control-products/redirect/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    control.redirected = true;
    await control.save();

    const redirect = new Redirect({
      newAddress: control.newSlug,
      oldAddress: control.oldSlug,
    });

    await redirect.save();
    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

router.get("/admin/control-products/delete/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    await control.delete();
    res.status(200).json({});
  } catch (err) {
    next(err);
  }
});

router.get("/admin/control-products/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

router.get("/admin/control-products/check/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    const newProduct = await Product.findOne({
      $or: [
        { slug: { $regex: control.oldSlug, $options: "i" } },
        { title: { $regex: control.oldTitle, $options: "i" } },
      ],
    });
    if (newProduct) {
      control.newTitle = newProduct.title;
      control.newSlug = newProduct.slug;
      await control.save();
    }
    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

router.put("/admin/control-products/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    const product = await Product.findOne({
      $or: [{ slug: control.newSlug }, { title: control.oldTitle }],
    });
    product.slug = req.body.newSlug;
    product.title = req.body.newTitle;
    await product.save();

    control.newTitle = req.body.newTitle;
    control.newSlug = req.body.newSlug;
    await control.save();
    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

//brands
router.get("/admin/control-brands", async (req, res, next) => {
  const perPage = +req.query.perPage || 50;
  const page = +req.query.page - 1 || 0;

  try {
    const query = {};
    if (req.query.title) {
      query.$or = [
        { newTitle: { $regex: req.query.title, $options: "i" } },
        { newSlug: { $regex: req.query.title, $options: "i" } },
        { oldTitle: { $regex: req.query.title, $options: "i" } },
        { oldSlug: { $regex: req.query.title, $options: "i" } },
      ];
    }

    query.type = "brand";

    const controls = await Control.find(query)
      .skip(page * perPage)
      .limit(perPage)
      .sort("-createdAt");

    const redControls = await Control.find({
      type: "brand",
      newTitle: { $exists: 0 },
    }).count();
    const greenControls = await Control.find({
      type: "brand",
      $where: "this.newSlug == this.oldSlug",
    });
    const brownControls = await Control.find({
      type: "brand",
      $where: "this.newSlug != this.oldSlug",
    });

    const count = await Control.find(query).count();
    const lastPage = Math.ceil(count / perPage);

    res.status(200).json({
      data: {
        redControlsCount: redControls,
        greenControlsCount: greenControls.length,
        brownControlsCount: brownControls.length,
        controls: controls,
      },
      meta: { count, lastPage },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/admin/control-brands/redirect/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    control.redirected = true;
    await control.save();

    const redirect = new Redirect({
      newAddress: control.newSlug,
      oldAddress: control.oldSlug,
    });

    await redirect.save();
    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

router.get("/admin/control-brands/check/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    const newBrand = await Brand.findOne({
      $or: [
        { slug: { $regex: control.oldSlug, $options: "i" } },
        { title: { $regex: control.oldTitle, $options: "i" } },
      ],
    });
    if (newBrand) {
      control.newTitle = newBrand.title;
      control.newSlug = newBrand.slug;
      await control.save();
    }
    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

router.get("/admin/control-brands/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });
    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

router.put("/admin/control-brands/:_id", async (req, res, next) => {
  try {
    const control = await Control.findOne({ _id: req.params._id });

    const brand = await Brand.findOne({
      $or: [{ slug: control.newSlug }, { title: control.newTitle }],
    });

    brand.slug = req.body.newSlug;
    brand.title = req.body.newTitle;
    await brand.save();

    control.newTitle = req.body.newTitle;
    control.newSlug = req.body.newSlug;
    await control.save();
    res.status(200).json(control);
  } catch (err) {
    next(err);
  }
});

//

router.get("/admin/fix-redirect", async (_, res) => {
  const redirects = await Redirect.find({});
  redirects.forEach(async (item) => {
    item.newAddress = item.newAddress.replace("brand/", "");
    item.oldAddress = item.oldAddress.replace("brand/", "");
    await item.save();
  });
  res.status(200).json({});
});

router.get("/admin/controls-fix-redirect", async (_, res) => {
  const redirects = await Redirect.find({});
  redirects.forEach(async (item) => {
    const control = await Control.findOne({ newSlug: item.newAddress });
    // console.log(control);
    control.redirected = true;
    await control.save();
  });
  res.status(200).json({});
});

router.get("/admin/controls/insert", async (_, res) => {
  axios.get("https://www.brandsreviews.com/control-brands").then((response) => {
    response?.data?.brands.forEach(async (brand) => {
      const newBrand = await Brand.findOne({
        $or: [
          { slug: { $regex: brand.slug, $options: "i" } },
          { title: { $regex: brand.title, $options: "i" } },
        ],
      });
      if (newBrand) {
        const control = new Control({
          newTitle: newBrand.title,
          newSlug: newBrand.slug,
          oldTitle: brand.title,
          oldSlug: brand.slug,
          type: "brand",
        });
        await control.save();
      } else {
        const control = new Control({
          oldTitle: brand.title,
          oldSlug: brand.slug,
          type: "brand",
        });
        await control.save();
      }
    });
  });
  res.send("done");
});

router.get("/admin/controls-product/insert", async (_, res) => {
  axios
    .get("https://www.brandsreviews.com/control-products")
    .then((response) => {
      response?.data?.products.forEach(async (product) => {
        const newProduct = await Product.findOne({
          $or: [
            { slug: { $regex: product.slug, $options: "i" } },
            { title: { $regex: product.title, $options: "i" } },
          ],
        });
        if (newProduct) {
          const control = new Control({
            newTitle: newProduct.title,
            newSlug: newProduct.slug,
            oldTitle: product.title,
            oldSlug: product.slug,
            type: "product",
          });
          await control.save();
        } else {
          const control = new Control({
            oldTitle: product.title,
            oldSlug: product.slug,
            type: "product",
          });
          await control.save();
        }
      });
    });
  res.send("done");
});

module.exports = router;
