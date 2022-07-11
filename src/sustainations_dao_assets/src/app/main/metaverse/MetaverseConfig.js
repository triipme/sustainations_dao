import { lazy } from "react";
import BootCamp from "./bootcamp/BootCamp";
import Land from "./land/Land";
import MetaverseLayout from "./MetaverseLayout";

const Metaverse = lazy(() => import("./Metaverse"));

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
          element: <BootCamp />
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
