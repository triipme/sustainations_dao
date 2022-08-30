import { styled } from "@mui/material/styles";
import history from "@history";
import { Box, Stack } from "@mui/material";
import { useEffect } from "react";

const btnWidth = 693;
const btnHeight = 163;
const xs = 0.17;
const sm = 0.3;
const lg = 0.5;
const xl = 0.6;
const Metaverse = () => {
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
      <Box
        // component="img"
        // src="metaverse/UI_finish.png"
        sx={{
          // objectFit: "contain",
          // m: "auto",
          // height: { xs: "auto", md: "100vh" },
          width: "100%",
          height: "100vh",
          backgroundImage: "url(metaverse/menu/Background.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "contain",
          display: "grid",
          placeItems: "center"
        }}>
        <Stack justifyContent="center" alignItems="center">
          <Box
            component="img"
            src="metaverse/menu/welcome.png"
            sx={{ objectFit: "cover", width: { xs: "50%", md: "80%" } }}
          />
          <Item
            src="metaverse/menu/introduction.png"
            onClick={() => window.open("https://www.youtube.com/watch?v=ZgwDobu5OcY", "_blank")}
          />
          <Item src="metaverse/menu/quest.png" onClick={() => history.push("/metaverse/quests")} />
          <Item
            src="metaverse/menu/bootcamp.png"
            onClick={() => history.push("/metaverse/bootcamp")}
          />
          <Item src="metaverse/menu/land.png" onClick={() => history.push("/metaverse/land")} />
          <Item src="metaverse/menu/departure.png" onClick={() => history.push("/")} />
        </Stack>
      </Box>
    </Box>
  );
};
export default Metaverse;
const Item = props => {
  return (
    <Box
      component="img"
      {...props}
      sx={{
        objectFit: "cover",
        height: {
          xs: btnHeight * xs,
          sm: btnHeight * sm,
          lg: btnHeight * lg,
          xl: btnHeight * xl
        },
        width: {
          xs: btnWidth * xs,
          sm: btnWidth * sm,
          lg: btnWidth * lg,
          xl: btnWidth * xl
        },
        objectPosition: "0% 0%",
        "&:hover": {
          objectPosition: "100% 0%"
        }
      }}
    />
  );
};
