import { lazy } from "react";
import { Outlet } from "react-router-dom";
import BootCamp from "./bootcamp/BootCamp";

const Metaverse = lazy(() => import("./Metaverse"));
const MapContainer = lazy(() => import("./land/Map"));
const FarmContainer = lazy(() => import("./land/Farm"));
const MetaverseLayout = lazy(() => import("./MetaverseLayout"));
const MemoryCardEnginePlay = lazy(() =>
  import("./bootcamp/memory-card-engine/MemoryCardEnginePlay")
);
const MemoryCardEngineLayout = lazy(() =>
  import("./bootcamp/memory-card-engine/MemoryCardEngineLayout")
);
const AR = lazy(() => import("./ar/AR"));
const Thanks = lazy(() => import("./ar/Thanks"));

const MetaverseConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false
        },
        toolbar: {
          display: false
        },
        footer: {
          display: false
        },
        leftSidePanel: {
          display: false
        },
        rightSidePanel: {
          display: false
        }
      }
    }
  },
  routes: [
    {
      path: "metaverse",
      element: <Metaverse />,
      auth: null
    },
    {
      path: "metaverse/quests",
      element: <MetaverseLayout />
    },
    {
      path: "metaverse/bootcamp",
      element: <Outlet />,
      children: [
        {
          index: true,
          element: <BootCamp />
        },
        {
          path: ":slug",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <MemoryCardEngineLayout />
            },
            {
              path: "play",
              element: <MemoryCardEnginePlay />
            }
          ]
        }
      ]
    },
    {
      path: "metaverse/land",
      element: <MapContainer />
    },
    {
      path: "metaverse/farm",
      element: <FarmContainer />
    },
    {
      path: "metaverse/ar",
      element: <AR />
    },
    {
      path: "metaverse/thanks",
      element: <Thanks />
    }
  ]
};

export default MetaverseConfig;
