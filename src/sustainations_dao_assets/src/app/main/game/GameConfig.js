import { lazy } from 'react';

const Game = lazy(() => import('./Game'));
const GameConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'game',
      element: <Game />,
    },
  ],
};

export default GameConfig;
