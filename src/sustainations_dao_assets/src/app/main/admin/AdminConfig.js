import { authRoles } from "../../auth";
import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { Query } from "matter";
// import QuestEngine from "./questEngine/QuestEngine";

const Admin = lazy(() => import("./Admin"));
const BootCampLayout = lazy(() => import("./bootcamp/BootCampLayout"));
const MemoryCardEngine = lazy(() => import("./bootcamp/MemoryCardEngine"));
const Metaverse = lazy(() => import("./metaverse/Metaverse"));
const QuestEngine = lazy(() => import("./questEngine/QuestEngine.js"));
const RefillBrands = lazy(() => import("./refill-brands/RefillBrands"));
const NewRefillBrand = lazy(() => import("./refill-brands/brand/NewRefillBrand"));
const EditRefillBrand = lazy(() => import("./refill-brands/brand/EditRefillBrand"));
const Settings = lazy(() => import("./settings/Settings"));

const AdminConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  auth: authRoles.admin,
  routes: [
    {
      path: "admin",
      element: <Admin />,
      children: [
        {
          index: true,
          element: <Navigate to="bootcamp" />
        },
        {
          path: "metaverse",
          element: <Metaverse />
        },
        {
          path: "questEngine",
          element: <QuestEngine />
        },
        {
          path: "bootcamp",
          children: [
            {
              index: true,
              element: <BootCampLayout />
            },
            {
              path: ":slug",
              element: <MemoryCardEngine />
            }
          ]
        },
        {
          path: 'refill-brands',
          children: [
            {
              index: true,
              element: <RefillBrands />
            },
            {
              path: 'new',
              element: <NewRefillBrand />
            },
            {
              path: ':brandId/edit',
              element: <EditRefillBrand />
            }
          ]
        },
        {
          path: 'settings',
          element: <Settings />
        }
      ]
    }
  ]
};

export default AdminConfig;
