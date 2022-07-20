import { useEffect, useState } from "react";
import AddGame from "../actions/AddGame";
import AllCard from "../views/AllCard";
import AllGame from "../views/AllSlug";
import AllStage from "../views/AllStage";

const MemoryCardEngineImport = () => {
  const [status, setStatus] = useState(false);
  const onSuccess = s => {
    setStatus(!!s);
  };
  useEffect(() => {
    return () => {
      setStatus(!status);
    };
  }, [status]);
  return (
    <div>
      <AddGame {...{ onSuccess }} />
      <AllGame {...{ status }} />
      <AllStage {...{ status }} />
      <AllCard {...{ status }} />
    </div>
  );
};

export default MemoryCardEngineImport;
