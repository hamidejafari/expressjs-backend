const Comparison = require("../../models/comparison.model");
const axios = require("axios");
const mongoose = require("mongoose");
const Brand = require("../../models/brand.model");
const elasticsearchService = require("../../services/elasticsearch.service");

const comparisonsGrouped = async (req, res, next) => {
  const perPage = +req.query.perPage || 5;
  const page = +req.query.page - 1 || 0;

  const match = { deleted: false };

  try {
    let brands = [];
    if (req.query.search) {
      let searchQuery = decodeURIComponent(req.query.search);
      searchQuery = searchQuery.toLowerCase().trim();

      if (req.user?.role !== "admin") {
        await elasticsearchService.post("search-history", {
          term: searchQuery,
          ip: req.body.ip,
          userAgent: req.body.userAgent,
          createdAt: new Date(),
        });
      }
      const searchQueryArray = searchQuery.split(" ");

      const lastItem = searchQueryArray[searchQueryArray.length - 1];

      searchQueryArray.splice(searchQueryArray.length - 1, 1);

      const firstItems = searchQueryArray.join(" ");

      const comparisonBody = {
        query: {
          bool: {
            must: [
              {
                term: { type: "brand" },
              },
              {
                bool: {
                  should: [
                    {
                      bool: {
                        must: [
                          {
                            prefix: {
                              compare1Id: lastItem,
                            },
                          },
                        ],
                      },
                    },
                    {
                      bool: {
                        must: [
                          {
                            prefix: {
                              compare2Id: lastItem,
                            },
                          },
                          {
                            match: {
                              compare2Id: firstItems,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      };

      if (firstItems) {
        comparisonBody.query.bool.must[1].bool.should[0].bool.must.push({
          match: {
            compare1Id: firstItems,
          },
        });

        comparisonBody.query.bool.must[1].bool.should[1].bool.must.push({
          match: {
            compare2Id: firstItems,
          },
        });
      }

      const comparisonSearch = await axios.post(
        process.env.ELASTICSEARCH_HOST + "/comparisons/_search",
        comparisonBody,
        {
          auth: {
            username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
            password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
          },
        }
      );

      if (
        comparisonSearch.data?.hits?.hits &&
        comparisonSearch.data?.hits?.hits.length > 0
      ) {
        const ids = comparisonSearch.data?.hits?.hits.map((item) =>
          mongoose.Types.ObjectId(item._id)
        );
        match._id = { $in: ids };
      } else {
        res
          .status(200)
          .json({ data: [], brands: [], meta: { lastPage: 1, count: 0 } });
      }
    } else {
      const brandComaprisons = await Comparison.find({
        onModel: "brand",
      }).select("compare1Id compare2Id");
      const brandIds = [];
      brandComaprisons.forEach((element) => {
        brandIds.push(element.compare1Id.toString());
        brandIds.push(element.compare2Id.toString());
      });
      const unique = [...new Set(brandIds)];
      brands = await Brand.find({
        _id: { $in: unique },
        "attributes.1": { $exists: true },
        special: { $ne: "ourBrand" },
      })
        .select("title image slug")
        .limit(50);
    }

    const productCategories = await Comparison.aggregate([
      { $match: { onModel: "product", ...match } },
      {
        $lookup: {
          from: "products",
          localField: "compare1Id",
          foreignField: "_id",
          as: "compare1Id",
          pipeline: [
            { $match: { deleted: false, "attributes.1": { $exists: true } } },
            { $project: { title: 1, brandId: 1 } },
          ],
        },
      },
      {
        $unwind: "$compare1Id",
      },
      {
        $lookup: {
          from: "brands",
          localField: "compare1Id.brandId",
          foreignField: "_id",
          pipeline: [
            { $match: { deleted: false } },
            { $project: { title: 1, image: 1 } },
          ],
          as: "compare1Id.brandId",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "compare2Id",
          foreignField: "_id",
          as: "compare2Id",
          pipeline: [
            {
              $match: { deleted: false, "attributes.1": { $exists: true } },
            },
            { $project: { title: 1, brandId: 1 } },
          ],
        },
      },
      {
        $unwind: "$compare2Id",
      },
      {
        $lookup: {
          from: "brands",
          localField: "compare2Id.brandId",
          foreignField: "_id",
          as: "compare2Id.brandId",
          pipeline: [
            { $match: { deleted: false } },
            { $project: { title: 1, image: 1 } },
          ],
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
          pipeline: [
            { $match: { deleted: false, "attributes.1": { $exists: true } } },
            { $project: { title: 1 } },
          ],
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$categoryId",
          compares: {
            $push: {
              _id: "$_id",
              compare1Id: "$compare1Id",
              compare2Id: "$compare2Id",
              onModel: "$onModel",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              category: "$category",
              compare1Product: "$compare1Product",
              compare1Brand: "$compare1Brand",
              compare2Product: "$compare2Product",
              compare2Brand: "$compare2Brand",
              slug: "$slug",
            },
          },
        },
      },
      { $sort: { _id: -1 } },
      {
        $facet: {
          meta: [{ $count: "count" }],
          data: [],
        },
      },
    ]);

    const brandCategories = await Comparison.aggregate([
      { $match: { onModel: "brand", ...match } },
      {
        $lookup: {
          from: "brands",
          localField: "compare1Id",
          foreignField: "_id",
          as: "compare1Id",
          pipeline: [
            { $match: { deleted: false, "attributes.1": { $exists: true } } },
            { $project: { title: 1, image: 1 } },
          ],
        },
      },
      {
        $unwind: "$compare1Id",
      },
      {
        $lookup: {
          from: "brands",
          localField: "compare2Id",
          foreignField: "_id",
          as: "compare2Id",
          pipeline: [
            { $match: { deleted: false, "attributes.1": { $exists: true } } },
            { $project: { title: 1, image: 1 } },
          ],
        },
      },
      {
        $unwind: "$compare2Id",
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
          pipeline: [
            { $match: { deleted: false, "attributes.1": { $exists: true } } },
            { $project: { title: 1 } },
          ],
        },
      },
      {
        $unwind: "$category",
      },
      {
        $group: {
          _id: "$categoryId",
          compares: {
            $push: {
              _id: "$_id",
              compare1Id: "$compare1Id",
              compare2Id: "$compare2Id",
              onModel: "$onModel",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              category: "$category",
              compare1Product: "$compare1Product",
              compare1Brand: "$compare1Brand",
              compare2Product: "$compare2Product",
              compare2Brand: "$compare2Brand",
              slug: "$slug",
            },
          },
        },
      },
      { $sort: { _id: -1 } },
      {
        $facet: {
          meta: [{ $count: "count" }],
          data: [],
        },
      },
    ]);

    const categories = {
      data: [...productCategories[0].data, ...brandCategories[0].data],
    };

    categories.data = categories.data.splice(page * perPage, perPage);

    if (categories) {
      if (productCategories[0].meta[0] && brandCategories[0].meta[0]) {
        categories.meta = {
          count:
            +productCategories[0].meta[0].count +
            +brandCategories[0].meta[0].count,
          lastPage: Math.ceil(
            (+productCategories[0].meta[0].count +
              +brandCategories[0].meta[0].count) /
              perPage
          ),
        };
      } else if (productCategories[0].meta[0]) {
        categories.meta = {
          count: +productCategories[0].meta[0].count,
          lastPage: Math.ceil(+productCategories[0].meta[0].count / perPage),
        };
      } else if (brandCategories[0].meta[0]) {
        categories.meta = {
          count: +brandCategories[0].meta[0].count,
          lastPage: Math.ceil(+brandCategories[0].meta[0].count / perPage),
        };
      }
    }

    categories.brands = brands;
    res.status(200).json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = comparisonsGrouped;
