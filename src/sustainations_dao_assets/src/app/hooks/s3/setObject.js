import _ from 'lodash';
import { s3Client } from "./s3Client.js"; // Helper function that creates an Amazon S3 service client module.

const upload = async (item) => {
  try {
    const params = {
      ACL: 'public-read',
      Body: item?.file,
      Bucket:  process.env.S3_BUCKET,
      Key: item?.name
    };
    const target = {
      Bucket:  process.env.S3_BUCKET,
      Key: item?.name
    };
    await s3Client.putObject(params).promise();
    const data = await s3Client.getObject(target).promise();
    console.log(data);
    return data;
  } catch (err) {
    console.log("Error", err);
  }
};

const setObject = async (fileState) => {
  if (_.isArray(fileState)) {
    return fileState.map(async item => await upload(item));
  } else if (!!fileState?.file) {
    return await upload(fileState);
  }
};

export default setObject;