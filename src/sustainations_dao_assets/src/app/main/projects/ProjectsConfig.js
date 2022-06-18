import { lazy } from 'react';

const Projects = lazy(() => import('./Projects'));
const ShowProject = lazy(() => import('./Project/ShowProject'));
const NewProject = lazy(() => import('./Project/NewProject'));

const ProjectsConfig = {
  settings: {
    layout: {},
  },
  routes: [
    {
      path: 'projects',
      element: <Projects />,
    },
    {
      path: 'projects/new',
      element: <NewProject />,
    },
    {
      path: 'projects/:projectId/',
      element: <ShowProject />,
    },
  ],
};

export default ProjectsConfig;
