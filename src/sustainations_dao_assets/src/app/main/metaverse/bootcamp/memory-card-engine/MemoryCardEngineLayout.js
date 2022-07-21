import { Stack } from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import MemoryCardEngineStage from "./MemoryCardEngineStage.component";
import MemoryCardEngineTop from "./MemoryCardEngineTop.component";

const MemoryCardEngineLayout = () => {
  const [gameId, setGameId] = useState();
  const { actor } = useSelector(state => state.user);
  const navigate = useNavigate();
  const { state: gameType } = useLocation();
  useEffect(() => {
    if (!gameType) {
      navigate(-1);
    }
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const rs = await actor.memoryCardEngineSlugEnabled(gameType);
        if ("ok" in rs) {
          setGameId(rs.ok);
        } else {
          throw rs.err;
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    gameType && (
      <Stack height="100vh" direction="column" justifyContent="center" alignItems="center">
        <MemoryCardEngineTop {...{ gameId, gameType }} />
        <MemoryCardEngineStage {...{ gameId, gameType }} />
      </Stack>
    )
  );
};

export default MemoryCardEngineLayout;
