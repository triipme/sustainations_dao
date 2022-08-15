import { authRoles } from "../../auth";
import { lazy } from "react";
import { Navigate } from "react-router-dom";

const RefillNetwork = lazy(() => import("./RefillNetwork"));
const Brand = lazy(() => import("./brand/Brand"));
const EditBrand = lazy(() => import("./brand/EditBrand"));
const Staffs = lazy(() => import("./staffs/Staffs"));
const NewStaff = lazy(() => import("./staffs/staff/NewStaff"));
const EditStaff = lazy(() => import("./staffs/staff/EditStaff"));
const Stations = lazy(() => import("./stations/Stations"));
const NewStation = lazy(() => import("./stations/station/NewStation"));
const EditStation = lazy(() => import("./stations/station/EditStation"));
const Categories = lazy(() => import("./categories/Categories"));
const NewCategory = lazy(() => import("./categories/category/NewCategory"));
const EditCategory = lazy(() => import("./categories/category/EditCategory"));
const Tags = lazy(() => import("./tags/Tags"));
const NewTag = lazy(() => import("./tags/tag/NewTag"));
const EditTag = lazy(() => import("./tags/tag/EditTag"));
const ProductUnits = lazy(() => import("./product-units/ProductUnits"));
const NewProductUnit = lazy(() => import("./product-units/product-unit/NewProductUnit"));
const EditProductUnit = lazy(() => import("./product-units/product-unit/EditProductUnit"));
const Products = lazy(() => import("./products/Products"));
const Product = lazy(() => import("./products/product/Product"));
const Orders = lazy(() => import("./orders/Orders"));
const Order = lazy(() => import("./orders/order/Order"));
const NewOrder = lazy(() => import("./orders/order/NewOrder"));
const EditOrder = lazy(() => import("./orders/order/EditOrder"));

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
        },
        {
          path: "stations",
          children: [
            {
              index: true,
              element: <Stations />
            },
            {
              path: "new",
              element: <NewStation />
            },
            {
              path: ":stationId/edit",
              element: <EditStation />
            }
          ]
        },
        {
          path: "categories",
          children: [
            {
              index: true,
              element: <Categories />
            },
            {
              path: "new",
              element: <NewCategory />
            },
            {
              path: ":categoryId/edit",
              element: <EditCategory />
            }
          ]
        },
        {
          path: "tags",
          children: [
            {
              index: true,
              element: <Tags />
            },
            {
              path: "new",
              element: <NewTag />
            },
            {
              path: ":tagId/edit",
              element: <EditTag />
            }
          ]
        },
        {
          path: "product-units",
          children: [
            {
              index: true,
              element: <ProductUnits />
            },
            {
              path: "new",
              element: <NewProductUnit />
            },
            {
              path: ":productUnitId/edit",
              element: <EditProductUnit />
            }
          ]
        },
        {
          path: "products",
          children: [
            {
              index: true,
              element: <Products />
            },
            {
              path: ":productId/*",
              element: <Product />
            }
          ]
        },
        {
          path: "orders",
          children: [
            {
              index: true,
              element: <Orders />
            },
            {
              path: "new",
              element: <NewOrder />
            },
            {
              path: ":orderId",
              element: <Order />
            },
            {
              path: ":orderId/edit",
              element: <EditOrder />
            }
          ]
        }
      ]
    }
  ]
};

export default RefillNetworkConfig;
