import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import _ from '@lodash';
import FuseSplashScreen from '@fuse/core/FuseSplashScreen';
import { showMessage } from 'app/store/fuse/messageSlice';
import { logoutUser, setUser } from 'app/store/userSlice';
import { getS3Object } from '../hooks';
import DfinityAgentService from './services/dfinityAgentService';

import { AuthClient } from '@dfinity/auth-client';
import { canisterId, createActor, idlFactory } from '../../../../declarations/sustainations_dao';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(undefined);
  const [waitAuthCheck, setWaitAuthCheck] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const initAuthClient = async () => {
      const client = await AuthClient.create();
      const authenticated = await client.isAuthenticated();
      let actor;
      const infinityWalletConnected = await window?.ic?.infinityWallet?.isConnected();
      if (authenticated) {
        setIsAuthenticated(authenticated); //check isAuthorized first time
        const identity = client.getIdentity();
        console.log('aaa', identity);
        actor = createActor(canisterId, {
          agentOptions: {
            identity
          }
        });
        const principal = identity.getPrincipal().toText();
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
          avatar
        };

        dispatch(setUser(userState));
        setWaitAuthCheck(false);
      } else if (infinityWalletConnected) {
        actor = await window.ic.infinityWallet.createActor({
          canisterId,
          interfaceFactory: idlFactory,
        });
        console.log(actor);

        const principal = await window.ic.infinityWallet.getPrincipal();
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
          principal: principal.toText(),
          brandId: result?.ok?.brandId[0],
          profile,
          avatar
        };

        dispatch(setUser(userState));
        setWaitAuthCheck(false);
      } else {
        pass();
        actor = createActor(canisterId);
        const userState = {
          role: [],
          actor,
          depositAddress: '',
          principal: '',
          balance: 0,
          brandId: null,
          profile: {},
          avatar: '',
        };
        dispatch(setUser(userState));
      }
    };

    const resetAuthClient = async () => {
      const client = await AuthClient.create();
      await client.logout();
    };

    initAuthClient();

    DfinityAgentService.on('onLogin', message => {
      success(message);
    });

    DfinityAgentService.on('onLogout', message => {
      pass(message);
      dispatch(logoutUser());
    });

    function success(message) {
      setWaitAuthCheck(true);
      Promise.all([initAuthClient()]).then(() => {
        setWaitAuthCheck(false);
        setIsAuthenticated(true);
        if (message) {
          dispatch(showMessage({ message }));
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
