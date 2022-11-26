import Text "mo:base/Text";
module Object {
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