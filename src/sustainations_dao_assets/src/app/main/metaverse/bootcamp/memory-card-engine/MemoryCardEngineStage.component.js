import { Principal } from "@dfinity/principal";
import { Button, Stack, Alert } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MemoryCardEngineStage = ({ gameId, slug: gameSlug }) => {
  const [stages, setStages] = useState();
  const [player, setPlayer] = useState();
  const { actor, principal } = useSelector(state => state.user);

  const navigate = useNavigate();
  useEffect(() => {
    if (gameId) {
      (async () => {
        try {
          const rs = await Promise.allSettled([
            actor.memoryCardEngineStages(gameId),
            actor.memoryCardEngineGetPlayer(Principal.fromText(principal), gameId, gameSlug)
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
  console.log(player);
  const handleClick = stageId => {
    return () => navigate("play", { state: { stageId, gameSlug, player, gameId } });
  };
  return stages?.length > 0 && stages?.length === 1 ? (
    <Button
      key={stages[0][0][0]}
      variant="contained"
      onClick={handleClick(stages[0][0][0])}
      disabled={player?.[1].history.some(h => {
        return (
          h.stageId === stages[0][0][0] &&
          h.timing > 0 &&
          parseInt(h.turn) > 0 &&
          h.selected.length > 0
        );
      })}>
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
            key={stage[0][0]}
            disabled={player?.[1].history.some(
              h =>
                h.stageId === stage[0][0] &&
                h.timing > 0 &&
                parseInt(h.turn) > 0 &&
                h.selected.length > 0
            )}
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
