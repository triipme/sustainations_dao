import { s3Client } from "./s3Client.js"; // Helper function that creates an Amazon S3 service client module.

const deleteObject = async (key) => {
  const bucketParams = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
  };
  try {
    await s3Client.deleteObject(bucketParams, function(err, data) {
      if (err) console.log(err, err.stack);
      else console.log("Success! Data:", data);
    }).promise();
  } catch (err) {
    console.log(err);
  }
};

export default deleteObject;