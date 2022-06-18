import { useCallback, useEffect, useState } from 'react';
import AWS from "aws-sdk";
import _ from 'lodash';

const useUploadFile = () => {
  const [fileState, setFileState] = useState();
  const [result, setResult] = useState();
  const creds = {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  };
  AWS.config.update(creds);
  const s3 = new AWS.S3({
    params: { Bucket: process.env.S3_BUCKET },
    region: process.env.S3_REGION
  });

  const upload = (item) => {
    if (!!item?.file) {
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
      s3.putObject(params)
        .send(err => {
          console.log("up");
          if (err) console.log(err);
          s3.getObject(target, (err, data) => {
            console.log("get");
            console.log("err", err, data);
            if (err != null) {
              console.log("Failed to retrieve an object", err);
            } else {
              console.log("data", data);
              setResult({
                _id: target.Key,
                url: URL.createObjectURL(new Blob([data.Body], { type: data.ContentType }))
              });
            }
          });
        });
    }
  };
  useEffect(() => {
    if (_.isArray(fileState)) {
      fileState.map(item => upload(item));
    } else if (!!fileState?.file) {
      upload(fileState);
    }
  }, [!_.isEmpty(fileState)]);
  const setFile = useCallback(state => setFileState(state), []);
  return [result, setFile];
};

export default useUploadFile;
