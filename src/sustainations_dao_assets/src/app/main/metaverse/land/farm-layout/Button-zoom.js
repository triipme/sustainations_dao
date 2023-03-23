import React, { useState } from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import ZoomInMap from "@mui/icons-material/ZoomInMap";
import ZoomOutMap from "@mui/icons-material/ZoomOutMap";
import Toolbar from "@mui/material/Toolbar";

function ButtonZoom({ handleWheelIncrease, handleWheelDecrease }) {
  return (
    <div
      style={{
        "position": "fixed",
        "left": "88%",
        "zIndex": "0",
        "top": "80%"
      }}>
      <Box sx={{ "& button": { m: 1 } }}>
        <Fab color="secondary" aria-label="add" onClick={handleWheelIncrease}>
          <ZoomOutMap />
        </Fab>
      </Box>
      <Box sx={{ "& button": { m: 1 } }}>
        <Fab color="secondary" aria-label="edit" onClick={handleWheelDecrease}>
          <ZoomInMap />
        </Fab>
      </Box>
    </div>
  );
}

export default ButtonZoom;
