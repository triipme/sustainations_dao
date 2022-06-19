import AWS from 'aws-sdk';

const creds = {
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY
};
AWS.config.update(creds);
const s3Client = new AWS.S3({
  params: { Bucket: process.env.S3_BUCKET },
  region: process.env.S3_REGION
});

export { s3Client }
