const axios = require("axios");

const adminAll = async (req, res, next) => {
  const page = +req.query.page - 1 || 0;

  try {
    const data = await axios.post(
      process.env.ELASTICSEARCH_HOST + "/search-history/_search",
      {
        from: page * 100,
        size: 100,
        sort: [{ createdAt: { order: "desc" } }],
      },
      {
        auth: {
          username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
          password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
        },
      }
    );

    const count = await axios.get(
      process.env.ELASTICSEARCH_HOST + "/search-history/_count",
      {
        auth: {
          username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
          password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
        },
      }
    );

    const c = +count.data.count;
    const lastPage = Math.ceil(c / 100);

    return res.send({
      data: data.data?.hits?.hits,
      meta: { c, lastPage },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = adminAll;
