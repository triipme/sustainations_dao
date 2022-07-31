import { authRoles } from "../../auth";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Admin = lazy(() => import("./Admin"));
const BootCampLayout = lazy(() => import("./bootcamp/BootCampLayout"));
const MemoryCardEngine = lazy(() => import("./bootcamp/MemoryCardEngine"));
const Metaverse = lazy(() => import("./metaverse/Metaverse"));

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
        }
      ]
    }
  ]
};

export default AdminConfig;
