import { authRoles } from "../../auth";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const RefillNetwork = lazy(() => import("./RefillNetwork"));
const Brand = lazy(() => import("./brand/Brand"));
const EditBrand = lazy(() => import("./brand/EditBrand"));
const Staffs = lazy(() => import("./staffs/Staffs"));
const NewStaff = lazy(() => import("./staffs/staff/NewStaff"));
const EditStaff = lazy(() => import("./staffs/staff/EditStaff"));

const RefillNetworkConfig = {
  settings: {
    layout: {
      config: {}
    }
  },
  auth: authRoles.refillBrandStaff,
  routes: [
    {
      path: "/refill-network",
      element: <RefillNetwork />,
      children: [
        {
          index: true,
          element: <Navigate to="brand" />
        },
        {
          path: "brand",
          children: [
            {
              index: true,
              element: <Brand />
            },
            {
              path: "edit",
              element: <EditBrand />
            }
          ]
        },
        {
          path: "staffs",
          children: [
            {
              index: true,
              element: <Staffs />
            },
            {
              path: "new",
              element: <NewStaff />
            },
            {
              path: ":staffPrincipal/edit",
              element: <EditStaff />
            }
          ]
        }
      ]
    }
  ]
};

export default RefillNetworkConfig;
