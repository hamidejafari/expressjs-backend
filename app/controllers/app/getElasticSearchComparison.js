const { default: axios } = require("axios");

const getElasticSearchComparison = async (req, res) => {
  try {
    let searchQuery = req.query.s;

    searchQuery = searchQuery.toLowerCase();

    if (!searchQuery) {
      return res.send({ message: "no query parameter" });
    }

    const comparisons = await axios.post(
      process.env.ELASTICSEARCH_HOST + "/comparisons/_search",
      {
        size: 10000,

        query: {
          bool: {
            should: [
              {
                prefix: {
                  compare1Id: searchQuery,
                },
              },
              {
                prefix: {
                  compare2Id: searchQuery,
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
      comparisons: comparisons.data?.hits?.hits,
    });
  } catch (err) {
    return res.send(err);
  }
};

module.exports = getElasticSearchComparison;
