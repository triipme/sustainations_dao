import i18next from "i18next";
import { authRoles } from "../auth";
import ar from "./navigation-i18n/ar";
import en from "./navigation-i18n/en";
import tr from "./navigation-i18n/tr";

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

const navigationConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    translate: "Dashboard",
    type: "item",
    icon: "dashboard_outlined",
    url: "dashboard"
  },
  {
    id: "projects",
    title: "Projects",
    translate: "Projects",
    type: "item",
    icon: "assignment_outlined",
    url: "projects"
  },
  {
    id: "metaverse",
    title: "Metaverse",
    translate: "Metaverse",
    type: "item",
    icon: "public_outlined",
    url: "metaverse"
  },
  {
    id: "admin",
    title: "Admin",
    type: "group",
    icon: "heroicons-outline:home",
    auth: authRoles.admin,
    children: [
      {
        id: "admin.bootcamp",
        title: "Bootcamp",
        type: "item",
        icon: "heroicons-outline:academic-cap",
        url: "admin"
      }
    ]
  }
];

export default navigationConfig;
