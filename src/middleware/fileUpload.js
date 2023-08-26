const multer = require("multer");
const path = require("path");
const createError = require("http-errors");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.env.UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const extName = path.extname(file.originalname);
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(extName, "") + extName
    );
  },
});

const fileType = process.env.ACCEPT_FILE;
const filteringFile = (req, file, cb) => {
  const extname = path.extname(file.originalname);
  if (!fileType.includes(extname.substring(1))) {
    return cb(createError(400, "File type not allowed"));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) },
  fileFilter: filteringFile,
});

module.exports = upload;
