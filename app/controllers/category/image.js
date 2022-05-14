const UploadService = require("../../services/upload.service");

const image = async (req, res) => {
    await UploadService.singleUpload(req.files.image);
    res.status(200).json({});
};

module.exports = image;