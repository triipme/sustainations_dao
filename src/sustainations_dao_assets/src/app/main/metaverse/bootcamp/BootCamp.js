import { Stack, Box, Typography, CardMedia, Card, CardContent, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const BootCamp = () => {
  const [games, setGames] = useState();
  const navigate = useNavigate();
  const { actor } = useSelector(state => state.user);
  useEffect(() => {
    (async () => {
      try {
        const rs = await actor.memoryCardEngineSlugEnabled();
        if ("ok" in rs) {
          setGames(rs.ok);
        } else {
          throw rs.err;
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  function onPressGame(gameId) {
    const game = games.find(g => g[0] === gameId);
    navigate(game[1].slug, { state: game[0] });
  }
  return (
    <Stack direction={"row"} m={3}>
      {games?.map((game, index) => (
        <Card key={game[0]} sx={{ maxWidth: 240, mr: 2 }}>
          <Box sx={{ cursor: "pointer" }} onClick={() => onPressGame(game[0])}>
            <CardMedia component="img" height="140" image={game[1]?.image} alt={game[1].name} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {game[1].name}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Stack>
  );
};

export default BootCamp;
