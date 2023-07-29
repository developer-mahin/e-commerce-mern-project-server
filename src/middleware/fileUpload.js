const multer = require("multer")
const path = require("path")

const UPLOAD_DIR = process.env.UPLOAD_DIR;

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR)
    },
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname)
        cb(null, Date.now() + "-" + file.originalname.repeat(extname, "") + extname)
    }

})

const upload = multer({ storage: storage });
module.exports = upload;