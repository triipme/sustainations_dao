import FuseLoading from "@fuse/core/FuseLoading";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import MemoryCardEngineCard from "./MemoryCardEngineCard";

const MemoryCardEnginePlay = () => {
  const { actor } = useSelector(state => state.user);
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();
  const { state: stateLocation } = useLocation();
  const ref = useRef(null);
  const prefixCard = useId();

  useEffect(() => {
    if (!stateLocation) {
      navigate(-1);
    }
  }, []);

  const api = useCallback(async () => {
    try {
      const { stageId, player, gameId, gameSlug } = stateLocation;
      const rsCards = await actor.memoryCardEngineStartStage(
        gameId,
        stageId,
        [].concat(player?.[0] || []),
        gameSlug
      );
      if ("ok" in rsCards) {
        setCards(rsCards.ok[0].flat());
        stateLocation.player = rsCards.ok[1];
      }
    } catch (error) {
      console.log(error);
    }
  }, []);
  const pair = useCallback(async (cardId1, cardId2) => {
    try {
      const { stageId, player, gameId, gameSlug } = stateLocation;
      const rsPair = await actor.memoryCardEngineCardPair(
        [cardId1, cardId2, +(ref.current.getTime() / 100).toFixed(2)],
        gameId,
        stageId,
        player,
        gameSlug
      );
      if ("ok" in rsPair) {
        return rsPair.ok;
      } else {
        throw rsPair.err;
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
      (async () => {
        setDisabled(true);
        ref.current.pause();
        const rsPair = await pair(choiceOne[0], choiceTwo[0]);
        ref.current.resume();
        if (rsPair) {
          setCards(prevCards => {
            return prevCards.map(card => {
              if (
                (card[0] === choiceOne[0] && card[1].data === choiceOne[1].data) ||
                (card[0] === choiceTwo[0] && card[1].data === choiceTwo[1].data)
              ) {
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
      })();
    }
  }, [choiceTwo?.[0]]);
  //handle choice
  const handleChoice = cardIndex => card => {
    choiceOne ? setChoiceTwo({ ...card, cardIndex }) : setChoiceOne({ ...card, cardIndex });
  };
  //reset choice
  const resetTurn = useCallback(() => {
    setChoiceOne(null);
    setChoiceTwo(null);
    if (choiceTwo?.[0]) {
      setTurns(prevTurns => [...prevTurns, [[choiceOne?.[0], choiceTwo?.[0]]]]);
    }
    setDisabled(false);
  }, [choiceTwo?.[0]]);
  const btnReset = useCallback(() => {
    api();
    ref.current.resetTime();
  }, []);
  return (
    stateLocation && (
      <Box className="container text-center" py={{ md: 5, xs: 0 }} px={{ md: 20, xs: 0 }}>
        <Typography variant="h4" textTransform="capitalize">
          Magic Memory {stateLocation?.gameSlug}
        </Typography>
        {cards?.length > 0 && <TimingPlay {...{ cards, turns, ref, stateLocation }} />}
        <Button variant="contained" size="large" onClick={btnReset} sx={{ mb: 3 }}>
          New Game
        </Button>
        <Grid container spacing={{ md: 2, xs: 1 }}>
          {cards.length > 0 ? (
            cards?.map((card, index) => (
              <Grid key={`${prefixCard}-${index}`} item xs={4} md={3} lg={2.4}>
                <MemoryCardEngineCard
                  {...card}
                  handleChoice={handleChoice(index)}
                  flipped={
                    //truong hop image can 1 cai khac nhau giua cac card
                    // (card[0] === choiceOne?.[0] && card[1].data === choiceOne[1].data) ||
                    // (card[0] === choiceTwo?.[0] && card[1].data === choiceTwo[1].data) ||
                    index === choiceOne?.cardIndex || index === choiceTwo?.cardIndex || card.matched
                  }
                  disabled={disabled}
                />
              </Grid>
            ))
          ) : (
            <FuseLoading />
          )}
        </Grid>
      </Box>
    )
  );
};

export default MemoryCardEnginePlay;

const TimingPlay = memo(
  forwardRef(({ turns, cards, stateLocation }, ref) => {
    const { stageId, player, gameId, gameSlug } = stateLocation;
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
    const completed = useCallback(() => {
      (async () => {
        try {
          console.log(turns);
          const rs = await actor?.memoryCardEngineCompletedStage(turns, stageId, player);
          console.log(rs);
          if ("ok" in rs) {
            navigate(-1);
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      })();
    }, [turns.length]);
    useImperativeHandle(ref, () => ({
      resetTime() {
        setTime(0);
      },
      pause() {
        setIsLoading(true);
      },
      resume() {
        setIsLoading(false);
      },
      getTime() {
        return time;
      }
    }));

    useEffect(() => {
      if (cards.length > 0) {
        if (cards.every(card => card.matched)) {
          // submit to Server
          setIsLoading(true);
          completed();
        }
      }
      if (turns.length === 0) {
        setTime(0);
      }
    }, [turns.length]);
    return (
      <Box my={2}>
        <Typography variant="h6">Turns: {turns.length}</Typography>
        <Typography variant="h6">Time: {(time / 100).toFixed(2)}</Typography>
        {isLoading && <FuseLoading />}
      </Box>
    );
  })
);
