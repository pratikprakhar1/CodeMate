const {S3Client,DeleteObjectCommand} = require('@aws-sdk/client-s3');
const dotenv = require('dotenv');


dotenv.config();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      accessKeyId: process.env.ACCESS_KEY_ID,
    },
});

const deleteFileFromS3 = async ( fileKey) => {
    try {
      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: fileKey,   
      };
      const command = new DeleteObjectCommand(params);
      await s3Client.send(command);
    } catch (err) {
      throw new Error('Error deleting file');
    }
  };
module.exports = deleteFileFromS3;