const { default: axios } = require("axios");

const getElasticSearchCategory = async (req, res) => {
  try {
    let searchQuery = req.query.s;

    searchQuery = searchQuery.toLowerCase();

    if (!searchQuery) {
      return res.send({ message: "no query parameter" });
    }

    const categories = await axios.post(
      process.env.ELASTICSEARCH_HOST + "/categories/_search",
      {
        size: 10000,

        query: {
          bool: {
            should: [
              {
                prefix: {
                  title: searchQuery,
                },
              },
              {
                prefix: {
                  searchTags: searchQuery,
                },
              },
            ],
          },
        },
      },
      {
        auth: {
          username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
          password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
        },
      }
    );

    return res.send({
      categories: categories.data?.hits?.hits,
    });
  } catch (err) {
    return res.send(err);
  }
};

module.exports = getElasticSearchCategory;
