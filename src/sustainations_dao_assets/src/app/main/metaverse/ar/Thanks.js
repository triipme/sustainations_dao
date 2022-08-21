import history from "@history";
import { Box } from "@mui/material";
import { useEffect } from "react";
const Thanks = () => {
  function handleClick(e) {
    history.replace("/metaverse");
  }
  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "grid",
        placeItems: "center",
        backgroundColor: "#000"
      }}>
      <Box sx={{ position: "relative" }}>
        <Box
          onClick={handleClick}
          component="img"
          src="metaverse/UI_back.png"
          sx={{
            position: "absolute",
            width: { xs: 30, md: 80 },
            objectFit: "contain",
            top: { xs: 10, md: 30 },
            right: { xs: 10, md: 30 }
          }}></Box>
        <Box
          component="img"
          src="metaverse/UI_finish.png"
          sx={{ objectFit: "contain", m: "auto", height: { xs: "auto", md: "100vh" } }}></Box>
      </Box>
    </Box>
  );
};
export default Thanks;
