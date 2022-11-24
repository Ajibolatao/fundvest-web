function _0x5c42(_0x1a0e53, _0x4dc73c) {
  const _0x2dda48 = _0x2dda();
  return (
    (_0x5c42 = function (_0x5c4296, _0x4fae00) {
      _0x5c4296 = _0x5c4296 - 0x69;
      let _0x22ad96 = _0x2dda48[_0x5c4296];
      return _0x22ad96;
    }),
    _0x5c42(_0x1a0e53, _0x4dc73c)
  );
}
function _0x2dda() {
  const _0x451451 = [
    "#inputBox2",
    "6065464afaXbV",
    "3945588wPOgcu",
    "2896323LtGRVI",
    "input",
    "addEventListener",
    "#inputBox",
    ".sellingAmt",
    ".convertAmt",
    "1034054XvwiXw",
    "766836LcTyOI",
    "toString",
    "textContent",
    "19517562WmcxbR",
    "2LyStES",
    "value",
    "querySelector",
    "5aEnCDt",
    "replace",
    "2657274fyOmEE",
  ];
  _0x2dda = function () {
    return _0x451451;
  };
  return _0x2dda();
}
const _0xa4c96 = _0x5c42;
(function (_0x3f2ca3, _0x1dfd1b) {
  const _0x456002 = _0x5c42,
    _0x10d568 = _0x3f2ca3();
  while (!![]) {
    try {
      const _0x35aad6 =
        parseInt(_0x456002(0x72)) / 0x1 +
        (parseInt(_0x456002(0x76)) / 0x2) * (-parseInt(_0x456002(0x6b)) / 0x3) +
        (parseInt(_0x456002(0x6a)) / 0x4) * (-parseInt(_0x456002(0x79)) / 0x5) +
        parseInt(_0x456002(0x7b)) / 0x6 +
        -parseInt(_0x456002(0x71)) / 0x7 +
        -parseInt(_0x456002(0x69)) / 0x8 +
        parseInt(_0x456002(0x75)) / 0x9;
      if (_0x35aad6 === _0x1dfd1b) break;
      else _0x10d568["push"](_0x10d568["shift"]());
    } catch (_0x321ac1) {
      _0x10d568["push"](_0x10d568["shift"]());
    }
  }
})(_0x2dda, 0x7f18e);
const sellingAmtEl = document["querySelector"](_0xa4c96(0x6f)),
  convertAmtEl = document[_0xa4c96(0x78)](_0xa4c96(0x70)),
  inputBoxEl = document["querySelector"](_0xa4c96(0x6e)),
  inputBoxEl2 = document["querySelector"](_0xa4c96(0x7c)),
  sellingAmt = Number(sellingAmtEl[_0xa4c96(0x74)]);
let convertAmt;
inputBoxEl[_0xa4c96(0x6d)](_0xa4c96(0x6c), () => {
  const _0x13fd3e = _0xa4c96;
  (convertAmt = inputBoxEl[_0x13fd3e(0x77)] * sellingAmt),
    (convertAmtEl["textContent"] = convertAmt[_0x13fd3e(0x73)]()[
      _0x13fd3e(0x7a)
    ](/\B(?=(\d{3})+(?!\d))/g, ",")),
    (inputBoxEl2["value"] = convertAmt);
});
