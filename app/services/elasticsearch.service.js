const axios = require("axios");

class elasticsearchService {
  static put(index, data) {
    return new Promise((resolve, reject) => {
      if (process.env.ENVIRONMENT === "development") {
        return resolve();
      }

      const _id = data._id;
      delete data._id;

      axios
        .put(
          process.env.ELASTICSEARCH_HOST + "/" + index + "/_doc/" + _id,
          data,
          {
            auth: {
              username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
              password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
            },
          }
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
  static post(index, data) {
    return new Promise((resolve, reject) => {
      if (process.env.ENVIRONMENT === "development") {
        return resolve();
      }

      axios
        .post(process.env.ELASTICSEARCH_HOST + "/" + index + "/_doc/", data, {
          auth: {
            username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
            password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
          },
        })
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static updateField(index, data) {
    return new Promise((resolve, reject) => {
      if (process.env.ENVIRONMENT === "development") {
        return resolve();
      }

      const _id = data._id;
      delete data._id;

      axios
        .post(
          process.env.ELASTICSEARCH_HOST + "/" + index + "/_update/" + _id,
          { doc: data },
          {
            auth: {
              username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
              password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
            },
          }
        )
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  static delete(index, _id) {
    return new Promise((resolve) => {
      if (process.env.ENVIRONMENT === "development") {
        return resolve();
      }

      axios
        .delete(process.env.ELASTICSEARCH_HOST + "/" + index + "/_doc/" + _id, {
          auth: {
            username: process.env.ELASTICSEARCH_ELASTIC_USERNAME,
            password: process.env.ELASTICSEARCH_ELASTIC_PASSWORD,
          },
        })
        .then((res) => {
          resolve(res);
        })
        .catch(() => {
          resolve("err");
        });
    });
  }
}

module.exports = elasticsearchService;
