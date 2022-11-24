const _0x3b1b98 = _0x2343;
(function (_0x2e166e, _0x40ed30) {
  const _0x361de2 = _0x2343,
    _0x255c13 = _0x2e166e();
  while (!![]) {
    try {
      const _0x3a6572 =
        (parseInt(_0x361de2(0xf6)) / 0x1) * (-parseInt(_0x361de2(0xef)) / 0x2) +
        (parseInt(_0x361de2(0xf5)) / 0x3) * (-parseInt(_0x361de2(0xee)) / 0x4) +
        -parseInt(_0x361de2(0xe8)) / 0x5 +
        parseInt(_0x361de2(0xe7)) / 0x6 +
        -parseInt(_0x361de2(0xf0)) / 0x7 +
        -parseInt(_0x361de2(0xed)) / 0x8 +
        parseInt(_0x361de2(0xf7)) / 0x9;
      if (_0x3a6572 === _0x40ed30) break;
      else _0x255c13["push"](_0x255c13["shift"]());
    } catch (_0x57498d) {
      _0x255c13["push"](_0x255c13["shift"]());
    }
  }
})(_0x2b0b, 0xdf686);
const principalEl = document[_0x3b1b98(0xf4)](_0x3b1b98(0xea)),
  durationEl = document[_0x3b1b98(0xf4)]("#durationBox"),
  amountEl = document[_0x3b1b98(0xf4)](_0x3b1b98(0xeb));
let rateEl = document[_0x3b1b98(0xf4)](_0x3b1b98(0xe9)),
  rate = Number(rateEl[_0x3b1b98(0xec)]),
  principal = Number(principalEl[_0x3b1b98(0xf2)]),
  duration = Number(durationEl[_0x3b1b98(0xf2)]),
  interest,
  amount;
const changeValue = () => {
  const _0x143ee3 = _0x3b1b98;
  (principal = Number(principalEl["value"])),
    (duration = Number(durationEl[_0x143ee3(0xf2)])),
    (interest = (principal * rate * (duration / 0xc)) / 0x64),
    (amount = principal + interest),
    (amountEl[_0x143ee3(0xec)] = amount[_0x143ee3(0xf3)]()["replace"](
      /\B(?=(\d{3})+(?!\d))/g,
      ","
    ));
};
function _0x2b0b() {
  const _0x308b0d = [
    "12711377rVkIxz",
    "addEventListener",
    "value",
    "toString",
    "querySelector",
    "3Ebtgaw",
    "427730rrdjNb",
    "53541999sMohgY",
    "change",
    "9092022yWbfyk",
    "2565050ZayWrB",
    ".rate",
    "#principalBox",
    ".amount",
    "textContent",
    "9992640LBRdxe",
    "6752716DBZROI",
    "6niGOjT",
  ];
  _0x2b0b = function () {
    return _0x308b0d;
  };
  return _0x2b0b();
}
function _0x2343(_0x40d258, _0x3e6f00) {
  const _0x2b0be1 = _0x2b0b();
  return (
    (_0x2343 = function (_0x234392, _0x3c208b) {
      _0x234392 = _0x234392 - 0xe6;
      let _0x57316 = _0x2b0be1[_0x234392];
      return _0x57316;
    }),
    _0x2343(_0x40d258, _0x3e6f00)
  );
}
principalEl[_0x3b1b98(0xf1)]("input", () => {
  changeValue();
}),
  durationEl[_0x3b1b98(0xf1)](_0x3b1b98(0xe6), () => {
    changeValue();
  });
