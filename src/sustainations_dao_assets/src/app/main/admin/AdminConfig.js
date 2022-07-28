import { lazy } from "react";

const Admin = lazy(() => import("./Admin"));

const AdminConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: "admin",
      element: <Admin />
    },
  ]
}

export default AdminConfig;