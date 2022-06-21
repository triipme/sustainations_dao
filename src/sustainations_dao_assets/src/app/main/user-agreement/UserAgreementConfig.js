import UserAgreement from './UserAgreement';
import authRoles from '../../auth/authRoles';

const UserAgreementConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.needAgreement,
  routes: [
    {
      path: 'user-agreement',
      element: <UserAgreement />,
    },
  ],
};

export default UserAgreementConfig;
