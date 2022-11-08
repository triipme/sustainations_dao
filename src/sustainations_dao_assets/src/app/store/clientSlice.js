/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { canisterId, idlFactory } from '../../../../declarations/sustainations_dao';
import { canisterId as ledgerCanisterId } from '../../../../declarations/ledger';
import { canisterId as frontendCanisterId } from '../../../../declarations/frontend';

import { createClient } from "@connect2ic/core";
import { InfinityWallet } from "@connect2ic/core/providers/infinity-wallet";
export const setClient = createAsyncThunk('client/setClient', async (client) => {
  return client;
});

const isDevelopment = process.env.NODE_ENV !== "production";
const initialState = createClient({
  providers: [
    // You may pass in different options to each provider
    new InfinityWallet({
      // boolean
      dev: isDevelopment,
      // whitelisted canisters
      whitelist: [canisterId, frontendCanisterId],
      // The host used for canisters
      host: window.location.origin,
    }),
  ],
  canisters: {
    sustainationsDao: {
      canisterId, idlFactory
    }
  },
  
  // Global config options for providers
  // These are options you want to enable on all providers
  globalProviderConfig: {
    // Determines whether root key is fetched
    // Should be enabled while developing locally & disabled in production
    dev: isDevelopment,
    // The host
    // Certain providers require specifying an app name
    appName: "Sustainations DAO",
    // Certain providers require specifying which canisters are whitelisted
    // Array<string>
    whitelist: [canisterId, frontendCanisterId],
    // Certain providers allow you to specify a canisterId for the Ledger canister
    // For example when running it locally
    ledgerCanisterId: isDevelopment ? ledgerCanisterId : "ryjl3-tyaaa-aaaaa-aaaba-cai",
    autoConnect: true
  },
});

const clientSlice = createSlice({
  name: 'client',
  initialState,
});

export const selectClient = ({ client }) => client;

export default clientSlice.reducer;
