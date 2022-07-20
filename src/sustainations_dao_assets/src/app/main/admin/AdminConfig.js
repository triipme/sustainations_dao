import { authRoles } from "../../auth";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Admin = lazy(() => import("./Admin"));
const BootCampLayout = lazy(() => import("./bootcamp/BootCampLayout"));
const MemoryCardEngine = lazy(() => import("./bootcamp/MemoryCardEngine"));

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
          path: "bootcamp",
          children: [
            {
              index: true,
              element: <BootCampLayout />
            },
            {
              path: "language",
              element: <MemoryCardEngine />
            },
            {
              path: "photo",
              element: <MemoryCardEngine />
            }
          ]
        }
      ]
    }
  ]
};

export default AdminConfig;
