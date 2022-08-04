import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';
import authRoles from '../auth/authRoles';

i18next.addResourceBundle("en", "navigation", en);
i18next.addResourceBundle("tr", "navigation", tr);
i18next.addResourceBundle("ar", "navigation", ar);

const navigationConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'item',
    icon: 'dashboard_outlined',
    url: '/dashboard',
  },
  {
    id: 'projects',
    title: 'Projects',
    type: 'item',
    icon: 'assignment_outlined',
    url: '/projects',
  },
  {
    id: 'one-refill-network',
    title: "One Refill Network",
    type: 'item',
    icon: 'cached_outlined',
    url: '/proposal-products',
  },
  {
    id: 'metaverse',
    title: 'Metaverse',
    type: 'item',
    icon: 'public_outlined',
    url: '/metaverse',
  },
  {
    id: 'refill-network-management',
    title: 'Refill Network Management',
    type: 'group',
    icon: 'room_preferences_outlined',
    auth: authRoles.refillBrandStaff,
    children: [
      {
        id: 'refill-brand',
        title: 'Brand',
        type: 'item',
        auth: authRoles.refillBrandOwner,
        url: '/refill-network/brand',
      },
      {
        id: 'refill-staffs',
        title: 'Staffs',
        type: 'item',
        auth: authRoles.refillBrandOwner,
        url: '/refill-network/staffs',
      },
      {
        id: 'refill-stations',
        title: 'Stations',
        type: 'item',
        auth: authRoles.refillBrandStaff,
        url: '/refill-network/stations',
      },
      {
        id: 'refill-categories',
        title: 'Categories',
        type: 'item',
        auth: authRoles.refillBrandStaff,
        url: '/refill-network/categories',
      },
      {
        id: 'refill-tags',
        title: 'Tags',
        type: 'item',
        auth: authRoles.refillBrandStaff,
        url: '/refill-network/tags',
      },
      {
        id: 'refill-product-units',
        title: 'Product Units',
        type: 'item',
        auth: authRoles.refillBrandStaff,
        url: '/refill-network/product-units',
      },
      {
        id: 'refill-products',
        title: 'Products',
        type: 'item',
        auth: authRoles.refillBrandStaff,
        url: '/refill-network/products',
      },
      {
        id: 'refill-orders',
        title: 'Orders',
        type: 'item',
        auth: authRoles.refillBrandStaff,
        url: '/refill-network/orders',
      },
    ],
  },
  {
    id: "admin",
    title: "Admin",
    type: "group",
    icon: "heroicons-outline:home",
    auth: authRoles.admin,
    children: [
      {
        id: "admin.metaverse",
        title: "Metaverse",
        type: "item",
        icon: "public_outlined",
        url: "admin/metaverse"
      },
      {
        id: "admin.bootcamp",
        title: "Bootcamp",
        type: "item",
        icon: "heroicons-outline:academic-cap",
        url: "admin/bootcamp"
      },
      {
        id: "admin-refill-brands",
        title: "Refill Brands",
        type: "item",
        icon: "room_preferences_outlined",
        url: "admin/refill-brands"
      }
    ]
  }
];

export default navigationConfig;
