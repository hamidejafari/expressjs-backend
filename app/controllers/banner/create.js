const Banner = require("../../models/banner.model");
const Category = require("../../models/category.model");
const LogService = require("../../services/log.service");
const UploadService = require("../../services/upload.service");

const create = async (req, res, next) => {
  try {
    if (req.files.image) {
      try {
        req.body.image = UploadService.singleUpload(req.files.image);
      } catch (error) {
        return res.status(400).json({ error: { image: [error] } });
      }
    } else {
      return res.status(400).json({ error: { image: ["image required."] } });
    }

    const banner = new Banner({
      image: { fileName: req.body.image, alt: req.body.imageAlt },
      modelId: req.body.modelId,
      url: req.body.url,
      selected: req.body.selected,
      brandExceptions: JSON.parse(req.body.brandIds),
      productExceptions: JSON.parse(req.body.productIds),
      onModel: "category",
    });

    if (req.body.startDate) {
      banner.startDate = new Date(req.body.startDate);
    }

    if (req.body.expireDate) {
      banner.expireDate = new Date(req.body.expireDate);
    }

    await banner.save();

    const category = await Category.findById(req.body.modelId);

    if (category) {
      if (category.level === 3) {
        category.bannerId = banner._id;
        await category.save();
      } else if (category.level === 2) {
        const catChilds = await Category.find({
          parentId: category._id,
          bannerId: { $exists: false },
        }).select("id");

        const catChildIds = catChilds.map((catChild) => {
          return catChild._id;
        });

        await Category.updateMany(
          {
            _id: { $in: [...catChildIds, req.body.modelId] },
            bannerId: { $exists: false },
          },
          { $set: { bannerId: banner._id } }
        );
      } else if (category.level === 1) {
        const catChilds2 = await Category.find({
          parentId: category._id,
          bannerId: { $exists: false },
        }).select("id");

        const catChild2Ids = catChilds2.map((catChild) => {
          return catChild._id;
        });

        const catChilds3 = await Category.find({
          parentId: { $in: catChild2Ids },
          bannerId: { $exists: false },
        }).select("id");

        const catChilds3Ids = catChilds3.map((catChild) => {
          return catChild._id;
        });

        await Category.updateMany(
          {
            _id: { $in: [...catChild2Ids, ...catChilds3Ids, req.body.modelId] },
            bannerId: { $exists: false },
          },
          { $set: { bannerId: banner._id } }
        );
      }
    }

    await LogService.create({
      model: "banner",
      url: req.originalUrl,
      method: req.method,
      data: req.body,
      modelId: banner._id,
      userId: req.user._id,
    });

    res.status(200).json(banner);
  } catch (err) {
    next(err);
  }
};

module.exports = create;
