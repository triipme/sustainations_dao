import { Stack, Box, Typography, CardMedia, Card, CardContent, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

const games = [
  {
    name: "Magic Memory Language",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor, veniam!",
    image:
      "https://media.istockphoto.com/vectors/memory-game-for-preschool-children-vector-id1092896082?k=20&m=1092896082&s=612x612&w=0&h=svAq2MxT5E9viByMj4r0JGzejZ_FM4qa93NExdDSqQk=",
    redirect: "language"
  },
  {
    name: "Magic Memory Photo",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolor, veniam!",
    image:
      "https://media.istockphoto.com/vectors/memory-game-for-preschool-children-vector-id1092896082?k=20&m=1092896082&s=612x612&w=0&h=svAq2MxT5E9viByMj4r0JGzejZ_FM4qa93NExdDSqQk=",
    redirect: "photo"
  }
];

const BootCamp = () => {
  const navigate = useNavigate();
  function onPressGame(game_i) {
    navigate(games[game_i].redirect, { state: games[game_i].redirect });
  }
  return (
    <Stack direction={"row"} m={3}>
      {games.map((game, index) => (
        <Card key={index} sx={{ maxWidth: 240, mr: 2 }}>
          <Box sx={{ cursor: "pointer" }} onClick={() => onPressGame(index)}>
            <CardMedia component="img" height="140" image={game.image} alt={game.name} />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {game.name}
              </Typography>
            </CardContent>
          </Box>
        </Card>
      ))}
    </Stack>
  );
};

export default BootCamp;
