import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/system";
import React, { memo } from "react";
import { motion } from "framer-motion";

function MemoryCardEngineCard({ handleChoice, flipped, disabled, ...card }) {
  const handleClick = () => {
    if (!disabled) {
      handleChoice(card);
    }
  };
  const theme = useTheme();
  const variants = {
    front: {
      rotateY: 0,
      transition: { delay: 0.1 }
    },
    back: {
      rotateY: 90,
      transition: { delay: 0 }
    }
  };
  return (
    <div className="card" style={{ border: `2px solid ${theme.palette.primary.main}` }}>
      <Box
        className="flex items-center justify-center text-center relative"
        sx={{ height: { md: 300, xs: 160 } }}>
        {/^[https|http]+/g.test(card[1].data) ? (
          <motion.div
            className="absolute w-full h-full grid place-items-center"
            variants={variants}
            initial={{ rotateY: 90, transition: { delay: 0 } }}
            animate={!flipped ? "back" : "front"}>
            <img src={flipped && card[1].data} alt="card" style={{ objectFit: "contain" }} />
          </motion.div>
        ) : (
          <motion.div
            className="absolute w-full h-fit grid place-items-center"
            variants={variants}
            initial={{ rotateY: 90, transition: { delay: 0 } }}
            animate={!flipped ? "back" : "front"}>
            <Typography variant="subtitle2">{flipped && card[1].data}</Typography>
          </motion.div>
        )}
        {
          <motion.img
            variants={variants}
            className="absolute w-full h-full"
            style={{ objectFit: "contain" }}
            animate={flipped ? "back" : "front"}
            src="images/logo/sustainations-logo.png"
            onClick={handleClick}
            alt="cover"></motion.img>
        }
      </Box>
    </div>
  );
}

export default memo(MemoryCardEngineCard);
