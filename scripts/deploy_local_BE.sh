export LEDGER_ID=$(dfx canister id ledger)
export GEORUST_ID=$(dfx canister id georust)

dfx deploy georust
dfx deploy sustainations_dao --argument "(record{
  ledgerId = opt(\"$LEDGER_ID\"); 
  georustId = opt(\"$GEORUST_ID\")
})"