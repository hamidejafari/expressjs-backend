const moment = require("moment");
const crypto = require("crypto");
const mkdirp = require("mkdirp");
const fs = require("fs");

const iconUpload = async (req, res, next) => {
  try {
    if (!req.files.icon) {
      return next();
    }

    const fileTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

    if (fileTypes.indexOf(req.files.icon.mimetype) === -1) {
      const error = new Error();
      error.code = 400;
      error.error = { icon: "فرمت فایل ارسالی صحیح نیست" };
      throw error;
    }

    const fileDest =
      "files/icon/" + moment().format("YYYY") + "/" + moment().format("MM");

    const fileName =
      crypto.randomBytes(18).toString("hex") +
      "." +
      req.files.icon.originalFilename.split(".")[
        req.files.icon.originalFilename.split(".").length - 1
      ];
    mkdirp.sync(fileDest);

    const oldPath = req.files.icon.filepath;
    req.body.icon = fileDest + "/" + fileName;
    req.body.iconRawData = fs.readFileSync(oldPath);

    if (req.files.iconSeo) {
      const fileName =
        crypto.randomBytes(18).toString("hex") +
        "." +
        req.files.iconSeo.originalFilename.split(".")[
          req.files.iconSeo.originalFilename.split(".").length - 1
        ];
      mkdirp.sync(fileDest);

      const oldPath = req.files.iconSeo.filepath;
      req.body.iconSeo = fileDest + "/" + fileName;
      req.body.iconSeoRawData = fs.readFileSync(oldPath);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = iconUpload;
