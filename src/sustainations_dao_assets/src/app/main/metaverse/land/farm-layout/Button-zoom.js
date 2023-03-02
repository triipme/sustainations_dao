import React, { useState } from "react";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
function ButtonZoom({ handleWheelIncrease, handleWheelDecrease}) {
  const [count, setCount] = useState(0);
  return (
    <div
      style={{
        "position": "fixed",
        "left": "88%",
        "zIndex": "0",
        "top": "80%"
      }}>
      <Box sx={{ "& button": { m: 1 } }}>
        <div>
          <Button variant="contained" color="secondary" onClick={handleWheelIncrease}>
            +
          </Button>
        </div>

        <div>
          <Button variant="contained" color="secondary" onClick={handleWheelDecrease}>
            -
          </Button>
        </div>
      </Box>
    </div>
  );
}

export default ButtonZoom;
