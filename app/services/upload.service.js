const mkdirp = require("mkdirp");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");
const crypto = require("crypto");
class UploadService {
  static singleUpload(
    image,
    smallSize = [100, 100],
    mediumSize = [400, 400],
    bigSize = [800, 800]
  ) {
    if (!image || !image.filepath) {
      return null;
    }
    const fileDest = "files/images/";
    let fileName = path.parse(image.originalFilename).name + ".webp";
    if (fs.existsSync(fileDest + "/main/" + fileName)) {
      fileName =
        path.parse(image.originalFilename).name +
        "_" +
        crypto.randomBytes(4).toString("hex") +
        ".webp";
    }
    mkdirp.sync(fileDest + "/main");
    mkdirp.sync(fileDest + "/big");
    mkdirp.sync(fileDest + "/medium");
    mkdirp.sync(fileDest + "/small");
    const oldPath = image.filepath;
    const newPath = fileDest + "/main/" + fileName;
    try {
      const rawData = fs.readFileSync(oldPath);
      fs.writeFileSync(newPath, rawData);
    } catch (err) {
      console.log(err);
      return null;
    }
    sharp(newPath)
      .resize(smallSize[0], smallSize[1])
      .toFile(fileDest + "/small/" + fileName, (err) => {
        console.log(err);
      });
    sharp(newPath)
      .resize(mediumSize[0], mediumSize[1])
      .toFile(fileDest + "/medium/" + fileName, (err) => {
        console.log(err);
      });

    sharp(newPath)
      .resize(bigSize[0], bigSize[1])
      .toFile(fileDest + "/big/" + fileName, (err) => {
        console.log(err);
      });

    // fs.unlink(newPath, function() {
    //   //
    // });
    return fileName;
  }
  static singleUploadBusiness(
    image,
    smallSize = [100, 100],
    mediumSize = [400, 400],
    bigSize = [800, 800]
  ) {
    if (!image || !image.filepath) {
      return null;
    }
    const fileDest = "files/images/";
    const fileName = crypto.randomBytes(18).toString("hex") + ".webp";
    mkdirp.sync(fileDest + "/main");
    mkdirp.sync(fileDest + "/big");
    mkdirp.sync(fileDest + "/medium");
    mkdirp.sync(fileDest + "/small");
    const oldPath = image.filepath;
    const newPath = fileDest + "/main/" + fileName;
    try {
      const rawData = fs.readFileSync(oldPath);
      fs.writeFileSync(newPath, rawData);
    } catch (err) {
      console.log(err);
      return null;
    }
    sharp(newPath)
      .resize(smallSize[0], smallSize[1])
      .toFile(fileDest + "/small/" + fileName, (err) => {
        console.log(err);
      });
    sharp(newPath)
      .resize(mediumSize[0], mediumSize[1])
      .toFile(fileDest + "/medium/" + fileName, (err) => {
        console.log(err);
      });

    sharp(newPath)
      .resize(bigSize[0], bigSize[1])
      .toFile(fileDest + "/big/" + fileName, (err) => {
        console.log(err);
      });

    // fs.unlink(newPath, function() {
    //   //
    // });
    return fileName;
  }
  static deleteFile(image) {
    const rootDirectory = process.cwd();
    fs.unlink(rootDirectory + "/files/images/main/" + image, (err) =>
      console.error(err)
    );
    fs.unlink(rootDirectory + "/files/images/small/" + image, (err) =>
      console.error(err)
    );
    fs.unlink(rootDirectory + "/files/images/medium/" + image, (err) =>
      console.error(err)
    );
    fs.unlink(rootDirectory + "/files/images/big/" + image, (err) =>
      console.error(err)
    );
    return true;
  }
}

module.exports = UploadService;
