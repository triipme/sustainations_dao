import '@mock-api';
import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useSelector } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import { selectUser } from 'app/store/userSlice';
import { selectClient } from 'app/store/clientSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import settingsConfig from 'app/configs/settingsConfig';
import withAppProviders from './withAppProviders';
import { AuthProvider } from './auth/AuthContext';
import  { HelmetProvider } from 'react-helmet-async';
import MetaTags from 'app/shared-components/MetaTags';
import { Connect2ICProvider } from "@connect2ic/react";

// import axios from 'axios';
/**
 * Axios HTTP Request defaults
 */
// axios.defaults.baseURL = "";
// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';

const emotionCacheOptions = {
  rtl: {
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
  ltr: {
    key: 'muiltr',
    stylisPlugins: [],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
};

const App = () => {
  const user = useSelector(selectUser);
  const client = useSelector(selectClient);
  const langDirection = useSelector(selectCurrentLanguageDirection);
  const mainTheme = useSelector(selectMainTheme);

  return (
    <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
      <HelmetProvider>
        <FuseTheme theme={mainTheme} direction={langDirection}>
          <Connect2ICProvider client={client}>
            <AuthProvider>
              <BrowserRouter>
                <FuseAuthorization
                  userRole={user.role}
                  inviter={user.inviter}
                  loginRedirectUrl={settingsConfig.loginRedirectUrl}
                >
                  <SnackbarProvider
                    maxSnack={5}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    classes={{
                      containerRoot: 'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                    }}
                  >
                    <MetaTags />
                    <FuseLayout layouts={themeLayouts} />
                  </SnackbarProvider>
                </FuseAuthorization>
              </BrowserRouter>
            </AuthProvider>
          </Connect2ICProvider>
        </FuseTheme>
      </HelmetProvider>
    </CacheProvider>
  );
};

export default withAppProviders(App)();
