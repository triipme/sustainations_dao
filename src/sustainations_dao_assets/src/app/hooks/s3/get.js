import { useEffect, useState } from 'react';
import AWS from 'aws-sdk';

const useGetFile = init => {
  const [result, setResult] = useState("");
  const [key, setKey] = useState(init ?? "");
  const creds = {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY
  };
  AWS.config.update(creds);
  const s3 = new AWS.S3({
    params: { Bucket: process.env.S3_BUCKET },
    region: process.env.S3_REGION
  });
  useEffect(() => {
    if (!!key) {
      console.log("key", key);
      const target = {
        Bucket: process.env.S3_BUCKET,
        Key: key
      };
      s3.getObject(target, (err, data) => {
        console.log("err", err, data);
        if (err != null) {
          console.log('Failed to retrieve an object', err);
        } else {
          console.log('data', data);
          setResult({
            _id: target.Key,
            url: URL.createObjectURL(new Blob([data.Body], { type: data.ContentType }))
          });
        }
      });
    }
  }, [key]);
  return [result, setKey];
};

export default useGetFile;
