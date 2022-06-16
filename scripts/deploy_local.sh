dfx start --background --clean --host 127.0.0.1:8000

### === DEPLOY LOCAL LEDGER =====
dfx identity new minter
dfx identity use minter
export MINT_ACC=$(dfx ledger account-id)

dfx identity use default
export LEDGER_ACC=$(dfx ledger account-id)

# Use private api for install
rm src/ledger/ledger.did
cp src/ledger/ledger.private.did src/ledger/ledger.did

dfx deploy ledger --no-wallet --argument '(record {
  minting_account = "'${MINT_ACC}'";
  initial_values = vec { record { "'${LEDGER_ACC}'"; record { e8s=100_000_000_000 } }; };
  send_whitelist = vec {}
  })'
export LEDGER_ID=$(dfx canister id ledger)

# Replace with public api
rm src/ledger/ledger.did
cp src/ledger/ledger.public.did src/ledger/ledger.did
dfx canister call ledger account_balance '(record { account = '$(python3 -c 'print("vec{" + ";".join([str(b) for b in bytes.fromhex("'$LEDGER_ACC'")]) + "}")')' })'

## === INSTALL FRONTEND / BACKEND ==== 

dfx deploy sustainations_dao --no-wallet --argument "(opt principal \"$LEDGER_ID\")"
dfx deploy frontend --no-wallet

# dfx canister call sustainations_dao withdraw '(100000)'