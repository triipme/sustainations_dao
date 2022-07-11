import AddGame from "../actions/AddGame";
import AllCard from "../views/AllCard";
import AllGame from "../views/AllSlug";
import AllStage from "../views/AllStage";

const MemoryCardEngine = () => {
  return (
    <div>
      <AddGame />
      <AllGame />
      <AllStage />
      <AllCard />
    </div>
  );
};

export default MemoryCardEngine;
