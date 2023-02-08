module {
  public type BitcoinAddress = Text;
  public type BlockHash = [Nat8];
  public type GetUtxosResponse = {
    next_page : ?Page;
    tip_height : Nat32;
    tip_block_hash : BlockHash;
    utxos : [Utxo];
  };
  public type MillisatoshiPerByte = Nat64;
  public type Network = { #Mainnet; #Regtest; #Testnet };
  public type OutPoint = { txid : [Nat8]; vout : Nat32 };
  public type Page = [Nat8];
  public type Satoshi = Nat64;
  public type Satoshi__1 = Nat64;
  public type SendRequest = {
    destination_address : Text;
    amount_in_satoshi : Satoshi;
  };
  public type Utxo = { height : Nat32; value : Satoshi; outpoint : OutPoint };
  public type Self = actor {
    get_balance : shared BitcoinAddress -> async Satoshi__1;
    get_current_fee_percentiles : shared () -> async [MillisatoshiPerByte];
    get_p2pkh_address : shared () -> async BitcoinAddress;
    get_utxos : shared BitcoinAddress -> async GetUtxosResponse;
    send : shared SendRequest -> async Text;
  };
};
