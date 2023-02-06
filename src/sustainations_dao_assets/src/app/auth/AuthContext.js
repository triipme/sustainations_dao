import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import _ from '@lodash';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import { selectClient } from 'app/store/clientSlice';
import { getS3Object } from '../hooks';
import DfinityAgentService from './services/dfinityAgentService';

import { AuthClient } from '@dfinity/auth-client';
import { canisterId, createActor } from '../../../../declarations/sustainations_dao';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  const client = useSelector(selectClient);

  useEffect(() => {
    const initAuthClient = async (inviter) => {
      const authClient = await AuthClient.create();
      const authenticated = await authClient.isAuthenticated();
      const status = await client.status;
      const walletAuthenticated = status.idle == "connected";
      let actor, principal;
      let logged = false;
      if (authenticated) {
        setIsAuthenticated(authenticated); //check isAuthorized first time
        const identity = authClient.getIdentity();
        actor = createActor(canisterId, {
          agentOptions: {
            identity
          }
        });
        principal = identity.getPrincipal().toText();
        logged = true;
      } else if (walletAuthenticated) {
        const error = client._service.state.context.actors['sustainationsDao'].error;
        if (error) {
          console.log('Error when connecting wallet!', error);
          return false;
        }
        setIsAuthenticated(walletAuthenticated); //check isAuthorized first time
        actor = client._service.state.context.actors['sustainationsDao'].value;
        principal = client.principal;
        logged = true;
      }
      if (logged) {
        const result = await actor.getUserInfo();
        let brandRole = [];
        const brandRoles = _.keys(result?.ok?.brandRole[0]);
        if (_.includes(brandRoles, 'owner')) {
          brandRole = ['brandOwner'];
        }
        if (_.includes(brandRoles, 'staff')) {
          brandRole = ['brandStaff'];
        }
        const profile = result?.ok?.profile[0];
        let avatar = '';
        if (profile?.avatar[0]) {
          async function getFile(path) {
            if (path) {
              const file = await getS3Object(path);
              return file;
            }
          };
          avatar = await getFile(profile?.avatar[0]);
        }
        const profileRole = _.isEmpty(profile?.role) ? ['user'] : _.keys(profile?.role);
        const userState = {
          role: result?.ok?.agreement ? _.union(profileRole, brandRole) : ['needAgreement'],
          actor,
          depositAddress: result?.ok?.depositAddress,
          balance: result?.ok?.balance,
          principal,
          brandId: result?.ok?.brandId[0],
          profile,
          avatar,
          inviter
        };
        console.log('userState', userState);
        dispatch(setUser(userState));
        setWaitAuthCheck(false);
      } else {
        pass();
        const userState = {
          role: [],
          actor: createActor(canisterId),
          depositAddress: '',
          principal: '',
          balance: 0,
          brandId: null,
          profile: {},
          avatar: '',
        };
        dispatch(setUser(userState));
      }
      return true;
    };

    const resetAuthClient = async () => {
      const authClient = await AuthClient.create();
      await authClient.logout();
      await client.disconnect();
    };

    initAuthClient();

    DfinityAgentService.on('onLogin', (message, uid) => {
      success(uid, message);
    });

    DfinityAgentService.on('onLogout', message => {
      pass(message);
      dispatch(logoutUser());
    });

    function success(uid, message) {
      setWaitAuthCheck(true);
      initAuthClient(uid).then((logged) => {
        if (logged) {
          setWaitAuthCheck(false);
          setIsAuthenticated(true);
          if (message) {
            dispatch(showMessage({ message }));
          }
        } else {
          pass('Error! Please try again later');
        }
      });
    }

    function pass(message) {
      if (message) {
        dispatch(showMessage({ message }));
      }
      Promise.all([resetAuthClient()]).then(() => {
        setWaitAuthCheck(false);
        setIsAuthenticated(false);
      });
    }
  }, [dispatch]);

  return waitAuthCheck ? (
    <FuseSplashScreen />
  ) : (
    <AuthContext.Provider value={{ isAuthenticated }}>{children}</AuthContext.Provider>
  );
}

function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export { AuthProvider, useAuth };
