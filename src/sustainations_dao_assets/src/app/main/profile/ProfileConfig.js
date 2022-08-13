import { lazy } from "react";

const Profile = lazy(() => import("./Profile"));
const EditProfile = lazy(() => import("./EditProfile"));

const ProfileConfig = {
  settings: {
    layout: {}
  },
  routes: [
    {
      path: "profile",
      element: <Profile />
    },
    {
      path: "profile/edit",
      element: <EditProfile />
    }
  ]
};

export default ProfileConfig;
