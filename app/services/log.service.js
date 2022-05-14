const Log = require("../models/log.model");

class LogService {
  static create(data) {
    return new Promise((resolve, reject) => {
      const log = new Log({
        model: data.model,
        url: data.url,
        method: data.method,
        data: JSON.stringify(data.data),
        modelId: data.modelId,
        userId: data.userId,
      });

      log
        .save()
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject("error happened.");
        });
    });
  }
}

module.exports = LogService;
