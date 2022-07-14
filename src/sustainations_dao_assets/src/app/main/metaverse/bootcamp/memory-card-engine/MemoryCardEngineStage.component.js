import { Button, Stack } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MemoryCardEngineStage = ({ slugId, game }) => {
  const [stages, setStages] = useState([]);
  const { actor } = useSelector(state => state.user);
  const navigate = useNavigate();
  const ref = useRef(null);
  useEffect(() => {
    if (slugId) {
      (async () => {
        try {
          const rs = await actor.memoryCardEngineStages(slugId);
          if ("ok" in rs) {
            setStages(rs.ok.sort((a, b) => parseInt(a[0][1].order - b[0][1].order)));
          } else {
            throw rs.err;
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [slugId]);
  const handleClick = stageId => {
    return () => navigate("play", { state: { id: stageId, game } });
  };
  return stages.length > 0 && stages.length === 1 ? (
    <Button key={stages[0][0][0]} variant="contained" onClick={handleClick(stages[0][0][0])}>
      Play
    </Button>
  ) : (
    <Stack direction="row">
      {stages.map(stage => (
        <Button
          sx={{ mx: 1 }}
          ref={ref}
          key={stage[0][0]}
          variant="contained"
          onClick={handleClick(stage[0][0])}>
          {stage[0][1].name}
        </Button>
      ))}
    </Stack>
  );
};

export default MemoryCardEngineStage;
