const moment = require("moment");
const crypto = require("crypto");
const mkdirp = require("mkdirp");
const fs = require("fs");

const imageUpload = async (req, res, next) => {
  try {
    if (!req.files.image) {
      return next();
    }

    const fileTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (fileTypes.indexOf(req.files.image.mimetype) === -1) {
      const error = new Error();
      error.code = 400;
      error.error = { image: "فرمت فایل ارسالی صحیح نیست" };
      throw error;
    }

    const fileDest =
      "files/" +
      moment().format("YYYY") +
      "/" +
      moment().format("MM") +
      "/" +
      crypto.randomBytes(18).toString("hex");

    const fileExtension =
      req.files.image.originalFilename.split(".")[
        req.files.image.originalFilename.split(".").length - 1
      ];

    const oldPath = req.files.image.filepath;
    req.body.image = fileDest;
    req.body.fileExtension = fileExtension;
    req.body.imageRawData = fs.readFileSync(oldPath);

    mkdirp.sync(fileDest);

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = imageUpload;
