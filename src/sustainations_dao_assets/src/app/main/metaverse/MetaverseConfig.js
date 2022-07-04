import { lazy } from 'react';

const Metaverse = lazy(() => import('./Metaverse'));

const MetaverseConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'metaverse',
      element: <Metaverse />,
    },
  ],
};

export default MetaverseConfig;
