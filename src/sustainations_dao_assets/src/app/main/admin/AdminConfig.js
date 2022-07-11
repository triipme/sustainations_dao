import { authRoles } from "../../auth";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const Admin = lazy(() => import("./Admin"));
const BootCamp = lazy(() => import("./bootcamp/BootCamp"));
const BootCampLayout = lazy(() => import("./bootcamp/BootCampLayout"));
const MemoryCardEnginePhoto = lazy(() => import("./bootcamp/MemoryCardPhoto"));
const MemoryCardEngineLanguage = lazy(() => import("./bootcamp/MemoryCardLanguage"));

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
              element: <MemoryCardEngineLanguage />
            },
            {
              path: "photo",
              element: <MemoryCardEnginePhoto />
            }
          ]
        }
      ]
    }
  ]
};

export default AdminConfig;
