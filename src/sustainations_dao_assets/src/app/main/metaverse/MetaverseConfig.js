import { lazy } from "react";
import { Outlet } from "react-router-dom";
import BootCamp from "./bootcamp/BootCamp";
import Land from "./land/Land";

const Metaverse = lazy(() => import("./Metaverse"));
const MetaverseLayout = lazy(() => import("./MetaverseLayout"));
const MemoryCardEnginePlay = lazy(() =>
  import("./bootcamp/memory-card-engine/MemoryCardEnginePlay")
);
const MemoryCardEngineLayout = lazy(() =>
  import("./bootcamp/memory-card-engine/MemoryCardEngineLayout")
);

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
      element: <MetaverseLayout />,
      children: [
        {
          index: true,
          element: <Metaverse />
        },
        {
          path: "bootcamp",
          element: <Outlet />,
          children: [
            {
              index: true,
              element: <BootCamp />
            },
            {
              path: "language",
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
            },
            {
              path: "photo",
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
          path: "land",
          element: <Land />
        }
      ]
    }
  ]
};

export default MetaverseConfig;
