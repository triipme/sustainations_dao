# yarn install
# vessel install

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
$(dfx cache show)/moc src/sustainations_dao/main.mo -c --debug --package base ./.vessel/base/f4f56295464a4b425921bd5121f6daff42d61304/src --package uuid ./.vessel/uuid/88871a6e1801c61ba54d42966f08be0604bb2a2d/src --package encoding ./.vessel/encoding/v0.3.1/src --package io ./.vessel/io/v0.3.0/src --package array ./.vessel/array/v0.1.1/src -o sustainations_dao.wasm

gzip sustainations_dao.wasm

dfx canister install sustainations_dao --mode upgrade --wasm sustainations_dao.wasm.gz
rm -rf sustainations_dao.wasm.gz
## === Transfer ICP to DAO's default subaccount ===
SYSTEM_ADDR=$(dfx canister call sustainations_dao getSystemAddress | tr -d '\n' | sed 's/,)/)/')
echo $SYSTEM_ADDR
dfx canister call ledger transfer "(record { amount = record { e8s = 10_000_000_000 }; to = $SYSTEM_ADDR; fee = record { e8s = 10_000}; memo = 1;})"
dfx canister call sustainations_dao getSystemBalance

# dfx canister call sustainations_dao withdraw '(100000)'
dfx deploy frontend
# yarn start