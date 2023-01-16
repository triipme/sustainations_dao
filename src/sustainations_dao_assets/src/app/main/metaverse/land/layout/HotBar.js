import { Grid, IconButton, Paper } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    overflowContainer: {
        overflowX: 'auto',
    },
    overflowContent: {
        display: 'flex',
        overflowX: 'auto',
        padding: theme.spacing(0, 2),
        position: "fixed",
        left:"50%",
        top: "89%",
        transform: "translate(-50%, -50%)",
    },
}));

const ITEM_NUM = 10;

export default function Hotbar() {
    const classes = useStyles();
    const [selectedSlot, setSelectedSlot] = useState(0);
    const [startIndex, setStartIndex] = useState(0);

    const handleClick = (slot) => {
        setSelectedSlot(slot);
    };

    const handleNext = () => {
        setStartIndex((prev) => prev + 5 > ITEM_NUM - 5 ? prev : prev + 5);
    };

    const handlePrev = () => {
        setStartIndex((prev) => prev - 5 < 0 ? 0 : prev - 5);
    };

    return (
        <div className={classes.root}>
            <IconButton onClick={handlePrev} disabled={startIndex === 0}>
                <ChevronLeft />
            </IconButton>
            <div className={classes.overflowContainer}>
                <div className={classes.overflowContent}>
                    {[...Array(ITEM_NUM)].map((_, i) => (
                        <Grid item xs={2} key={i}>
                            <Paper
                                className={classes.paper}
                                onClick={() => handleClick(i)}
                                style={{ backgroundColor: i === selectedSlot ? 'lightblue' : 'white' }}
                            >
                                Slot {i + 1}
                            </Paper>
                        </Grid>
                    )).slice(startIndex, startIndex + 5)}
                </div>
            </div>
            <IconButton onClick={handleNext} disabled={startIndex + 5 >= ITEM_NUM}>
                <ChevronRight />
            </IconButton>
        </div>
    );
}
