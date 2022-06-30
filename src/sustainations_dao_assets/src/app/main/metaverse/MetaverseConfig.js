import { lazy } from 'react';

const Metaverse = lazy(() => import('./Metaverse'));

const MetaverseConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  routes: [
    {
      path: 'metaverse',
      element: <Metaverse />,
    },
  ],
};

export default MetaverseConfig;
