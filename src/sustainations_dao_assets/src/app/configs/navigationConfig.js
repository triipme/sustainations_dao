import i18next from 'i18next';
import ar from './navigation-i18n/ar';
import en from './navigation-i18n/en';
import tr from './navigation-i18n/tr';

i18next.addResourceBundle('en', 'navigation', en);
i18next.addResourceBundle('tr', 'navigation', tr);
i18next.addResourceBundle('ar', 'navigation', ar);

const navigationConfig = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    translate: 'Dashboard',
    type: 'item',
    icon: 'heroicons-outline:desktop-computer',
    url: 'dashboard',
  },
  {
    id: 'projects',
    title: 'Projects',
    translate: 'Projects',
    type: 'item',
    icon: 'heroicons-outline:clipboard-check',
    url: 'projects',
  },
  {
    id: 'metaverse',
    title: 'Metaverse',
    translate: 'Metaverse',
    type: 'item',
    icon: 'heroicons-outline:globe-alt',
    url: 'https://3r6bs-jyaaa-aaaal-aaaba-cai.ic0.app/metaverse',
    target: '_blank',
    external: true,
  },
];

export default navigationConfig;
