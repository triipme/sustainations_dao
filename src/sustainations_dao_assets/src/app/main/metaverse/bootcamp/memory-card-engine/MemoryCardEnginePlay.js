import FuseLoading from "@fuse/core/FuseLoading";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import MemoryCardEngineCard from "./MemoryCardEngineCard";
import { v4 as uuidv4 } from "uuid";

const MemoryCardEnginePlay = () => {
  const { actor } = useSelector(state => state.user);
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const { state: stateLocation } = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    if (!stateLocation) {
      navigate(-1);
    }
  }, []);

  const api = useCallback(async () => {
    try {
      const rsCards = await actor.memoryCardEngineCards(stateLocation.stageId);
      if ("ok" in rsCards) {
        shuffleCards(rsCards.ok);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    api();
  }, []);

  //compare selected cards
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.cardId === choiceTwo.cardId) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.cardId === choiceOne.cardId) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(() => resetTurn(), 500);
      }
    }
  }, [choiceOne?.id, choiceTwo?.id]);

  //shuffle
  const shuffleCards = useCallback(cards => {
    const shuffledCards = cards
      .concat(cards)
      .map((card, cardIndex, array) => ({
        ...card[0][1],
        cardId: card[0][0],
        id: uuidv4(),
        data: card[0][1].cardType === "text" ? card[0][1].data.split(":") : card[0][1].data,
        dataType:
          card[0][1].cardType === "text" ? (cardIndex > array.length / 2 - 1 ? 0 : 1) : "default"
      }))
      .sort(() => Math.random() - 0.5);
    setTurns(0);
    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffledCards);
    ref.current?.resetTime();
  }, []);

  //handle choice
  const handleChoice = card => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  };

  //reset choice
  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
  };
  const btnReset = () => {
    api();
    ref.current.resetTime();
  };
  return (
    stateLocation && (
      <Box className="container text-center" py={{ md: 5, xs: 0 }} px={{ md: 20, xs: 0 }}>
        <Typography variant="h4" textTransform="capitalize">
          Magic Memory {stateLocation?.game}
        </Typography>
        {cards?.length > 0 && <TimingPlay {...{ cards, turns, ref, stateLocation }} />}
        <Button variant="contained" size="large" onClick={btnReset} sx={{ mb: 3 }}>
          New Game
        </Button>
        <Grid container spacing={{ md: 2, xs: 1 }}>
          {cards?.map(card => (
            <Grid key={card.id} item xs={4} md={3} lg={2.4}>
              <MemoryCardEngineCard
                {...card}
                handleChoice={handleChoice}
                flipped={card.id === choiceOne?.id || card.id === choiceTwo?.id || card.matched}
                disabled={disabled}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  );
};

export default MemoryCardEnginePlay;

const TimingPlay = memo(
  forwardRef(({ turns, cards, stateLocation }, ref) => {
    const { stageId, player, slugId } = stateLocation;
    const { actor } = useSelector(state => state.user);
    const [time, setTime] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
      const to = setTimeout(() => {
        !isLoading && setTime(prevTime => prevTime + 1);
      }, 10);
      return () => clearTimeout(to);
    }, [time, isLoading]);

    async function apiSetPlayer() {
      try {
        const rs = await actor?.memoryCardEngineSetPlayer({
          playerId: [].concat(player?.[0] || []),
          stageId,
          slugId,
          turn: turns,
          timing: parseFloat((time / 100).toFixed(2))
        });
        if ("ok" in rs) {
          navigate(-1);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    useImperativeHandle(ref, () => ({
      resetTime() {
        resetTime();
      }
    }));
    function resetTime() {
      setTime(0);
    }
    useEffect(() => {
      if (cards.length > 0) {
        if (cards.every(card => card.matched)) {
          // submit to Server
          setIsLoading(true);
          apiSetPlayer();
        }
      }
      if (turns === 0) {
        setTime(0);
      }
    }, [turns]);
    return (
      <Box my={2}>
        <Typography variant="h6">Turns: {turns}</Typography>
        <Typography variant="h6">Time: {(time / 100).toFixed(2)}</Typography>
        {isLoading && <FuseLoading />}
      </Box>
    );
  })
);
