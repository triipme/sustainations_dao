import UserAgreements from './UserAgreements';

const UserAgreementsConfig = {
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
  auth: null,
  routes: [
    {
      path: 'user-agreements/:uid',
      element: <UserAgreements />,
    },
  ],
};

export default UserAgreementsConfig;
