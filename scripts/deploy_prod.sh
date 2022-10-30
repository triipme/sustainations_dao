dfx deploy --network ic georust
export GEORUST_ID=$(dfx canister --network ic id georust)
export LEGGER_ID="ryjl3-tyaaa-aaaaa-aaaba-cai"
dfx deploy --network ic sustainations_dao --argument "(record{
  ledgerId = opt(\"$LEDGER_ID\"); 
  georustId = opt(\"$GEORUST_ID\")
})"
dfx deploy --network ic frontend