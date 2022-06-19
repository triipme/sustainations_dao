import { useState } from 'react';
import { useAsyncMemo } from "use-async-memo";
import _ from 'lodash';
import { getS3Object } from "../../../hooks";

const ShowProjectMedia = ({ images }) => {
  const [loading, setLoading] = useState(true)
  const files = useAsyncMemo(async () => {
    setLoading(true);
    async function getFile(path) {
      const file = await getS3Object(path);
      return file;
    };
    const result = await Promise.all(images[0].map(async (item) => await getFile(item)));
    setLoading(false);
    return result;
  }, [images]);

  return React.useMemo(
    () => (
      <div className="w-full">
        {!loading && files.map((item, index) => (
          <div className="flex items-center mt-8" key={index}>
            <img className="flex-auto m-w" src={item} />
          </div>
        ))}
      </div>
    )
  );
};

export default ShowProjectMedia;
