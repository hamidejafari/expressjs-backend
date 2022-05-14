const { default: axios } = require("axios");
const elasticsearchService = require("../../services/elasticsearch.service");

const search = async (req, res, next) => {
  try {
    let searchQuery = decodeURIComponent(req.query.title);

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

    if (!searchQuery) {
      return res.send({ message: "no query parameter" });
    }

    //Brands

    const brandBody = {
      size: 10000,
      query: {
        bool: {
          should: [
            {
              bool: {
                must: [
                  {
                    prefix: {
                      title: lastItem,
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
                      searchTags: lastItem,
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
      brandBody.query.bool.should[0].bool.must.push({
        match: {
          title: firstItems,
        },
      });

      brandBody.query.bool.should[1].bool.must.push({
        match: {
          title: firstItems,
        },
      });
    }

    const brandAxios = axios.post(
      process.env.ELASTICSEARCH_HOST + "/brands/_search",
      brandBody,
      {
        auth: {
          username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
          password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
        },
      }
    );

    //Products
    const productBody = {
      size: 10000,

      query: {
        bool: {
          must: [
            {
              prefix: {
                title: lastItem,
              },
            },
          ],
        },
      },
    };

    if (firstItems) {
      productBody.query.bool.must.push({
        match: {
          title: firstItems,
        },
      });
    }

    const productAxios = axios.post(
      process.env.ELASTICSEARCH_HOST + "/products/_search",
      productBody,
      {
        auth: {
          username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
          password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
        },
      }
    );

    //Categories
    const categoryBody = {
      size: 10000,

      query: {
        bool: {
          must: [
            {
              prefix: {
                title: lastItem,
              },
            },
          ],
        },
      },
    };

    if (firstItems) {
      categoryBody.query.bool.must.push({
        match: {
          title: firstItems,
        },
      });
    }

    const categoryAxios = axios.post(
      process.env.ELASTICSEARCH_HOST + "/categories/_search",
      categoryBody,
      {
        auth: {
          username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
          password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
        },
      }
    );

    //Comparisons
    const comparisonBody = {
      size: 10000,
      query: {
        bool: {
          should: [
            {
              prefix: {
                compare1Id: lastItem,
              },
            },
            {
              prefix: {
                compare2Id: lastItem,
              },
            },
          ],
        },
      },
    };

    if (firstItems) {
      comparisonBody.query.bool.should.push({
        match: {
          compare1Id: firstItems,
        },
      });
      comparisonBody.query.bool.should.push({
        match: {
          compare2Id: firstItems,
        },
      });
    }

    const comparisonAxios = axios.post(
      process.env.ELASTICSEARCH_HOST + "/comparisons/_search",
      comparisonBody,
      {
        auth: {
          username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
          password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
        },
      }
    );

    const [categories, products, brands, comparisons] = await Promise.all([
      categoryAxios,
      productAxios,
      brandAxios,
      comparisonAxios,
    ]);

    const response = {};

    if (brands?.data?.hits?.hits) {
      response.brands = brands.data?.hits?.hits;
    }

    if (products?.data?.hits?.hits) {
      response.products = products.data?.hits?.hits;
    }

    if (categories?.data?.hits?.hits) {
      response.categories = categories.data?.hits?.hits;
    }

    if (comparisons?.data?.hits?.hits) {
      response.comparisons = comparisons.data?.hits?.hits;
    }

    res.status(200).json({ data: response });
  } catch (err) {
    // throw(err);
    next(err);
  }
};

module.exports = search;
