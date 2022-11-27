import Text "mo:base/Text";
import Char "mo:base/Char";
import Nat32 "mo:base/Nat32";
import Nat64 "mo:base/Nat64";
import Int64 "mo:base/Int64";
import Float "mo:base/Float";
import Debug "mo:base/Debug";
module Object {
  public func textToFloat( txt : Text) : Float {
    assert(txt.size() > 0);
    let chars = txt.chars();
    var num : Float = 0;
    var weight : Float = 10;
    for (v in chars) {
      if (Char.isDigit(v)) {
        let charToNum = Float.fromInt64(Int64.fromNat64(Nat64.fromNat(Nat32.toNat(Char.toNat32(v)-48))));
        Debug.print(debug_show (charToNum));
        assert(charToNum >= 0 and charToNum <= 9);
        if (weight < 10) {
          weight := weight * 0.1;
          num := num + charToNum * weight;
        } else {
          num := num * weight + charToNum;
        }
      } else {
        weight := weight * 0.1;
      };
      Debug.print(debug_show (weight, num));
    };
    num;
  };
  public func getValue(t: Text, k: Text): Text {
    for(e:Text in Text.split(t, #char '{')){
      if(Text.contains(e, #text k)){
        if(Text.contains(e, #char '{')){
          return getValue(e, k);
        } else {
          for(i:Text in Text.split(e, #char ',')){
            if(Text.contains(i, #text k)){
              for(s:Text in Text.split(i, #char ':')){
                if(Text.contains(s, #text k) == false){
                  var r : Text = Text.replace(s, #char '\"', "");
                  r := Text.replace(r, #char ']', "");
                  r := Text.replace(r, #char '}', "");
                  return r;
                };
              };
            };
          };
        };
      };
    };
    return "Not found";
  };
}