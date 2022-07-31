import { Stack } from "@mui/material";
import { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import MemoryCardEngineStage from "./MemoryCardEngineStage.component";
import MemoryCardEngineTop from "./MemoryCardEngineTop.component";

const MemoryCardEngineLayout = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { state: gameId } = useLocation();
  useEffect(() => {
    if (!slug || !gameId) {
      navigate(-1);
    }
  }, []);
  return (
    slug && (
      <Stack height="100vh" direction="column" justifyContent="center" alignItems="center">
        <MemoryCardEngineTop {...{ gameId, slug }} />
        <MemoryCardEngineStage {...{ gameId, slug }} />
      </Stack>
    )
  );
};

export default MemoryCardEngineLayout;
