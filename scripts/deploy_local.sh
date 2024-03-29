#!/bin/bash

vessel install

### === DEPLOY LOCAL LEDGER =====
dfx identity new minter
dfx identity use minter
MINT_ACC=$(dfx ledger account-id)

dfx identity use default
LEDGER_ACC=$(dfx ledger account-id)

# Use private api for install
rm src/ledger/ledger.did
cp src/ledger/ledger.private.did src/ledger/ledger.did

dfx deploy ledger --argument '(record {
  minting_account = "'${MINT_ACC}'";
  initial_values = vec { record { "'${LEDGER_ACC}'"; record { e8s=100_000_000_000_000 } }; };
  send_whitelist = vec {}
  })'
dfx deploy georust
# dfx deploy internet_identity

# Replace with public api
rm src/ledger/ledger.did
cp src/ledger/ledger.public.did src/ledger/ledger.did
dfx canister call ledger account_balance '(record { account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$LEDGER_ACC'")]) + "}")')' })'

# update ./src/sustainations_dao/.env.mo
LEDGER_ID=$(dfx canister id ledger)
GEORUST_ID=$(dfx canister id georust)

FILE="./src/sustainations_dao/.env.mo"

/bin/cat <<EOM >$FILE
module Env {
  public let LEDGER_ID = "${LEDGER_ID}";
  public let GEORUST_ID = "${GEORUST_ID}";
}
EOM

## === INSTALL FRONTEND / BACKEND ====
dfx deploy sustainations_dao
## === Transfer ICP to DAO's default subaccount ===
SYSTEM_ADDR=$(dfx canister call sustainations_dao getSystemAddress | tr -d '\n' | sed 's/,)/)/')
echo $SYSTEM_ADDR
dfx canister call ledger transfer "(record { amount = record { e8s = 10_000_000_000 }; to = $SYSTEM_ADDR; fee = record { e8s = 10_000}; memo = 1;})"
dfx canister call sustainations_dao getSystemBalance

# dfx canister call sustainations_dao withdraw '(100000)'
yarn install
dfx generate frontend
dfx deploy frontend
# yarn start