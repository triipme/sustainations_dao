import { lazy } from "react";

const Projects = lazy(() => import("./Projects"));
const ShowProject = lazy(() => import("./project/ShowProject"));
const NewProject = lazy(() => import("./project/NewProject"));

const ProjectsConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: "projects",
      element: <Projects proposalType={{ project: null }} />,
      auth: null
    },
    {
      path: "projects/new",
      element: <NewProject proposalType={{ project: null }} />
    },
    {
      path: "projects/:projectId/",
      element: <ShowProject />
    }
  ]
};

export default ProjectsConfig;
