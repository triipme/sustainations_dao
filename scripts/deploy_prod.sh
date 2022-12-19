#!/bin/bash

dfx deploy --network ic georust

# update ./src/sustainations_dao/.env.mo
LEDGER_ID="ryjl3-tyaaa-aaaaa-aaaba-cai"
GEORUST_ID=$(dfx canister --network ic id georust)

FILE="./src/sustainations_dao/.env.mo"

/bin/cat <<EOM >$FILE
module Env {
  public let LEDGER_ID = "${LEDGER_ID}";
  public let GEORUST_ID = "${GEORUST_ID}";
}
EOM

$(dfx cache show)/moc src/sustainations_dao/main.mo -c --debug --package base ./.vessel/base/f4f56295464a4b425921bd5121f6daff42d61304/src --package uuid ./.vessel/uuid/88871a6e1801c61ba54d42966f08be0604bb2a2d/src --package encoding ./.vessel/encoding/v0.3.1/src --package io ./.vessel/io/v0.3.0/src --package array ./.vessel/array/v0.1.1/src -o sustainations_dao.wasm
gzip sustainations_dao.wasm
dfx canister --network ic install sustainations_dao --mode upgrade --wasm sustainations_dao.wasm.gz
dfx deploy --network ic frontend
rm -rf ./sustainations_dao.wasm.gz
