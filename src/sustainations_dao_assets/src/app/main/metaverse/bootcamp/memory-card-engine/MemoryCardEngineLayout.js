import { Stack } from "@mui/material";
import { useEffect, useLayoutEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import MemoryCardEngineStage from "./MemoryCardEngineStage.component";
import MemoryCardEngineTop from "./MemoryCardEngineTop.component";

const MemoryCardEngineLayout = () => {
  const [slugId, setSlugId] = useState();
  const { actor } = useSelector(state => state.user);
  const navigate = useNavigate();
  const { state: game } = useLocation();
  useEffect(() => {
    if (!game) {
      navigate(-1);
    }
  }, []);
  useEffect(() => {
    (async () => {
      try {
        const rs = await actor.memoryCardEngineSlugEnabled(game);
        if ("ok" in rs) {
          setSlugId(rs.ok);
        } else {
          throw rs.err;
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    game && (
      <Stack height="100vh" direction="column" justifyContent="center" alignItems="center">
        <MemoryCardEngineTop {...{ slugId, game }} />
        <MemoryCardEngineStage {...{ slugId, game }} />
      </Stack>
    )
  );
};

export default MemoryCardEngineLayout;
