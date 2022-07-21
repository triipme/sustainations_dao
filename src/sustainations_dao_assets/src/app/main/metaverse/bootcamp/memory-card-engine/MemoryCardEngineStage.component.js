import { Principal } from "@dfinity/principal";
import { Button, Stack, Alert } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MemoryCardEngineStage = ({ gameId, gameType }) => {
  const [stages, setStages] = useState();
  const [player, setPlayer] = useState();
  const { actor, principal } = useSelector(state => state.user);

  const navigate = useNavigate();
  const ref = useRef(null);
  useEffect(() => {
    if (gameId) {
      (async () => {
        try {
          const rs = await Promise.allSettled([
            actor.memoryCardEngineStages(gameId),
            actor.memoryCardEngineGetPlayer(Principal.fromText(principal), gameId)
          ]);
          if ("ok" in rs[0].value) {
            setStages(rs[0].value.ok.sort((a, b) => parseInt(a[0][1].order - b[0][1].order)));
          }
          if ("ok" in rs[1].value) {
            setPlayer(rs[1].value.ok);
          }
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [gameId]);
  const handleClick = stageId => {
    return () => navigate("play", { state: { stageId, gameType, player, gameId } });
  };
  return stages?.length > 0 && stages?.length === 1 ? (
    <Button
      key={stages[0][0][0]}
      variant="contained"
      onClick={handleClick(stages[0][0][0])}
      disabled={player?.[1].history.some(h => h.stageId === stages[0][0][0])}>
      Play
    </Button>
  ) : (
    <>
      {(player?.[1].history.length ?? 0) < stages?.length && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You need to play all levels to be ranked on the Leaderboard and receice ICP
        </Alert>
      )}
      <Stack direction="row">
        {stages?.map(stage => (
          <Button
            sx={{ mx: 1 }}
            ref={ref}
            key={stage[0][0]}
            disabled={player?.[1].history.some(h => h.stageId === stage[0][0])}
            variant="contained"
            onClick={handleClick(stage[0][0])}>
            {stage[0][1].name}
          </Button>
        ))}
      </Stack>
    </>
  );
};

export default MemoryCardEngineStage;
