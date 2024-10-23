const {S3Client} = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv');


dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.ACCESS_KEY_ID,
    },
});

const upload = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.BUCKET_NAME,
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        cb(null, Date.now().toString());
      },
    }),
  });

  module.exports = upload;