function _0x3a1e() {
  const _0x35d8c7 = [
    "400712EWzFOS",
    "2SxGIld",
    "hide",
    "querySelector",
    "add",
    "973600KfCvTz",
    "1178737GZAXJO",
    ".hidden-balance",
    "700365bcLbYB",
    "6XaWTWV",
    ".bi-eye",
    "forEach",
    "classList",
    "remove",
    ".bi-eye-slash",
    ".balance__amount",
    "15206aDGvZx",
    "addEventListener",
    "2409130PwvNtR",
    "923395ziKNXG",
    "querySelectorAll",
    "81uzBILi",
  ];
  _0x3a1e = function () {
    return _0x35d8c7;
  };
  return _0x3a1e();
}
const _0x34de7c = _0x1752;
(function (_0x2e7827, _0x886087) {
  const _0x2c8280 = _0x1752,
    _0xa65841 = _0x2e7827();
  while (!![]) {
    try {
      const _0x594e9a =
        (-parseInt(_0x2c8280(0x1bc)) / 0x1) *
          (-parseInt(_0x2c8280(0x1c3)) / 0x2) +
        parseInt(_0x2c8280(0x1ca)) / 0x3 +
        -parseInt(_0x2c8280(0x1c7)) / 0x4 +
        (-parseInt(_0x2c8280(0x1bf)) / 0x5) *
          (parseInt(_0x2c8280(0x1cb)) / 0x6) +
        -parseInt(_0x2c8280(0x1c8)) / 0x7 +
        (parseInt(_0x2c8280(0x1c2)) / 0x8) *
          (parseInt(_0x2c8280(0x1c1)) / 0x9) +
        parseInt(_0x2c8280(0x1be)) / 0xa;
      if (_0x594e9a === _0x886087) break;
      else _0xa65841["push"](_0xa65841["shift"]());
    } catch (_0xe4d950) {
      _0xa65841["push"](_0xa65841["shift"]());
    }
  }
})(_0x3a1e, 0x53f61);
const actualBalancesEl = document[_0x34de7c(0x1c0)](_0x34de7c(0x1d1)),
  hiddenBalancesEl = document["querySelectorAll"](_0x34de7c(0x1c9)),
  showBtn = document[_0x34de7c(0x1c5)](_0x34de7c(0x1cc)),
  closeBtn = document[_0x34de7c(0x1c5)](_0x34de7c(0x1d0));
function _0x1752(_0x1d2048, _0x29a70d) {
  const _0x3a1ee2 = _0x3a1e();
  return (
    (_0x1752 = function (_0x17526a, _0x5be135) {
      _0x17526a = _0x17526a - 0x1bc;
      let _0x73159c = _0x3a1ee2[_0x17526a];
      return _0x73159c;
    }),
    _0x1752(_0x1d2048, _0x29a70d)
  );
}
showBtn[_0x34de7c(0x1bd)]("click", () => {
  const _0x7c034a = _0x34de7c;
  hiddenBalancesEl[_0x7c034a(0x1cd)]((_0x4653fe) => {
    const _0x47cd6b = _0x7c034a;
    _0x4653fe["classList"]["add"](_0x47cd6b(0x1c4));
  }),
    actualBalancesEl[_0x7c034a(0x1cd)]((_0x46b650) => {
      const _0x548849 = _0x7c034a;
      _0x46b650[_0x548849(0x1ce)][_0x548849(0x1cf)](_0x548849(0x1c4));
    });
}),
  closeBtn[_0x34de7c(0x1bd)]("click", () => {
    const _0x1032d5 = _0x34de7c;
    actualBalancesEl[_0x1032d5(0x1cd)]((_0xf93cc8) => {
      const _0x488116 = _0x1032d5;
      _0xf93cc8["classList"][_0x488116(0x1c6)](_0x488116(0x1c4));
    }),
      hiddenBalancesEl[_0x1032d5(0x1cd)]((_0x2bd3a4) => {
        const _0x3854ed = _0x1032d5;
        _0x2bd3a4["classList"][_0x3854ed(0x1cf)](_0x3854ed(0x1c4));
      });
  });
