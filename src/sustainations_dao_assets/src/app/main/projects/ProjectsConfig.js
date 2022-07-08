import { lazy } from "react";

<<<<<<< HEAD
const Projects = lazy(() => import('./Projects'));
const ShowProject = lazy(() => import('./project/ShowProject'));
const NewProject = lazy(() => import('./project/NewProject'));
=======
const Projects = lazy(() => import("./Projects"));
const ShowProject = lazy(() => import("./project/ShowProject"));
const NewProject = lazy(() => import("./project/NewProject"));
>>>>>>> 5d496caf5ee7b55dc4202ba61eb9e8647c59e37f

const ProjectsConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: "projects",
      element: <Projects />
    },
    {
      path: "projects/new",
      element: <NewProject />
    },
    {
      path: "projects/:projectId/",
      element: <ShowProject />
    }
  ]
};

export default ProjectsConfig;
