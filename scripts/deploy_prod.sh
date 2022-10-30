dfx deploy --network ic georust
export GEORUST_ID=$(dfx canister --network ic id georust)
dfx deploy --network ic sustainations_dao --argument "(record{
  ledgerId = opt(\"ryjl3-tyaaa-aaaaa-aaaba-cai\"); 
  georustId = opt(\"$GEORUST_ID\")
})"
dfx deploy --network ic frontend