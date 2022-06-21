import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import Error404Page from '../main/404/Error404Page';
import ProjectDashboardAppConfig from '../main/dashboard/ProjectDashboardAppConfig';
import ProjectsConfig from '../main/projects/ProjectsConfig';
import UserAgreementConfig from '../main/user-agreement/UserAgreementConfig';
import UserAgreementsConfig from '../main/user-agreements/UserAgreementsConfig';
const routeConfigs = [
  ProjectDashboardAppConfig,
  ProjectsConfig,
  UserAgreementConfig,
  UserAgreementsConfig,
  SignOutConfig,
  SignInConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(routeConfigs, settingsConfig.defaultAuth),
  {
    path: '/',
    element: <Navigate to="/projects" />,
    auth: settingsConfig.defaultAuth,
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
];

export default routes;
