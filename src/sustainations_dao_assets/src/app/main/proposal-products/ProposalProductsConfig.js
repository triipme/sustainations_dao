import { lazy } from "react";

const ProposalProducts = lazy(() => import("./ProposalProducts"));
const ShowProject = lazy(() => import("../projects/project/ShowProject"));
const NewProject = lazy(() => import("../projects/project/NewProject"));

const ProposalProductsConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: "proposal-products",
      element: <ProposalProducts />
    },
    {
      path: "proposal-products/new",
      element: <NewProject proposalType={{ product: null }} />
    },
    {
      path: "proposal-products/:projectId/",
      element: <ShowProject />
    }
  ]
};

export default ProposalProductsConfig;
