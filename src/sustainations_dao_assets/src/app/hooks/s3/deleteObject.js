import _ from "lodash";
import { s3Client } from "./s3Client.js"; // Helper function that creates an Amazon S3 service client module.

const deleteItem = async (key) => {
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

const deleteObject = async (key) => {
  if (_.isArray(key)) {
    return key.map(async item => await deleteItem(item));
  } else if (_.isString(key)) {
    return await deleteItem(key);
  }
};

export default deleteObject;