import { s3Client } from "./s3Client.js"; // Helper function that creates an Amazon S3 service client module.

const getObject = async (key) => {
  try {
    const bucketParams = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
    };
    const data = await s3Client.getObject(bucketParams).promise();

    // Check for image payload and formats appropriately
    if( data.ContentType === 'image/jpeg' ) {
      return data.Body.toString('base64');
    } else {
      return data.Body.toString('utf-8');
    }
  } catch (err) {
    console.log("Error", err);
  }
};

export default getObject;