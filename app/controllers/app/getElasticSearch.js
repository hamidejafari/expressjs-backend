const { default: axios } = require("axios");

const getElasticSearch = async (req, res) => {
  try {
    let searchQuery = decodeURIComponent(req.query.s);

    searchQuery = searchQuery.toLowerCase().trim();

    const searchQueryArray = searchQuery.split(" ");

    const lastItem = searchQueryArray[searchQueryArray.length - 1];

    searchQueryArray.splice(searchQueryArray.length - 1, 1);

    const firstItems = searchQueryArray.join(" ");

    if (!searchQuery) {
      return res.send({ message: "no query parameter" });
    }

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

    const [brand, product] = await Promise.all([brandAxios, productAxios]);

    let comparisons;

    if (brand.data?.hits?.hits.length === 1) {
      const comparisonBody = {
        size: 10000,
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

      comparisons = await axios.post(
        process.env.ELASTICSEARCH_HOST + "/comparisons/_search",
        comparisonBody,
        {
          auth: {
            username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
            password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
          },
        }
      );
    }

    const response = {};

    if (brand?.data?.hits?.hits) {
      response.brand = brand.data?.hits?.hits;
    }

    if (product?.data?.hits?.hits) {
      response.product = product.data?.hits?.hits;
    }

    if (comparisons?.data?.hits?.hits) {
      response.comparisons = comparisons.data?.hits?.hits;
    }

    return res.send(response);
  } catch (err) {
    return res.send(err);
  }
};

module.exports = getElasticSearch;
