import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// instType	产品类型 币币SPOT 币币杠杆MARGIN 永续合约SWAP 交割合约FUTURES 期权OPTION	string
// instId	产品ID 如BTC-USD-SWAP	string
// uly	标的指数 仅适用于instType为交割/永续/期权 如BTC-USD	string
// category	手续费档位 每个交易产品属于哪个档位手续费	string
// baseCcy	交易货币币种 如BTC-USDT中的BTC 仅适用于币币	string
// quoteCcy	计价货币币种 如BTC-USDT中的USDT 仅适用于币币	string
// settleCcy	盈亏结算和保证金币种 如BTC 仅适用于交割/永续/期权	string
// ctVal	合约面值 仅适用于交割/永续/期权	number
// ctMult	合约乘数 仅适用于交割/永续/期权	integer(int32)
// ctValCcy	合约面值计价币种 仅适用于交割/永续/期权	string
// optType	期权类型 C或P 仅适用于期权	string
// stk	行权价格 仅适用于期权	number
// listTime	上线日期 Unix时间戳的毫秒数格式 如1597026383085	integer(int64)
// expTime	交割/行权日期 仅适用于交割和期权 Unix时间戳的毫秒数格式 如1597026383085	integer(int64)
// lever	该instId支持的最大杠杆倍数 不适用于币币、期权	integer(int32)
// tickSz	下单价格精度 如0.0001	number
// lotSz	下单数量精度 如BTC-USDT-SWAP 1	number
// minSz	最小下单数量	number
// ctType	正向合约linear 反向合约inverse 仅适用于交割/永续	string
// alias	合约日期别名 本周this_week 次周next_week 季度quarter 次季度next_quarter 仅适用于交割	string
// state	产品状态 关闭中closed 交易中live 暂停中suspend 预上线preopen 资金费结算settlement	string
// maxLmtSz	合约或现货限价单的单笔最大委托数量	integer(int32)
// maxMktSz	合约或现货市价单的单笔最大委托数量	integer(int32)
// maxTwapSz	合约或现货时间加权单的单笔最大委托数量	integer(int32)
// maxIcebergSz	合约或现货冰山委托的单笔最大委托数量	integer(int32)
// maxTriggerSz	合约或现货计划委托委托的单笔最大委托数量	integer(int32)
// maxStopSz	合约或现货止盈止损委托的单笔最大委托数量	integer(int32)
// remark	备注	string
// createTime	创建时间	integer(int64)
// updateBy	更新人	string
// updateTime	更新时间	integer(int64)
export const forms = [
  {
    title: "交易货币币种",
    name: "baseCcy",
    rules: [{ required: true, message: "币种不能为空", trigger: "blur" }],
  },
  {
    title: "计价货币币种",
    name: "quoteCcy",
    rules: [{ required: true, message: "币种中文名不能为空", trigger: "blur" }],
  },
  {
    title: "产品ID",
    name: "instId",
    rules: [
      { required: true, message: "提币精度不能为空", trigger: "blur" },
      {
        pattern: /^\d{1,2}$/,
        message: "提币精度为最多2位的整数",
        trigger: "blur",
      },
    ],
  },
  {
    title: "产品类型",
    name: "instType",
    rules: [
      {
        required: true,
        message: "产品类型不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "下单价格精度",
    name: "tickSz",
    rules: [{ required: true, message: "区块链不能为空", trigger: "blur" }],
  },
  {
    title: "下单数量精度",
    name: "lotSz",
    rules: [
      { required: true, message: "最小提币手续费不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "手续费档位",
    name: "category",
    rules: [{ required: true, message: "手续费档位不能为空", trigger: "blur" }],
  },
  {
    title: "上线日期",
    name: "listTime",
    rules: [
      { required: true, message: "最大提币手续费不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "最小下单数量",
    name: "minSz",
    rules: [
      {
        required: true,
        message: "币种单笔最大提币量不能为空",
        trigger: "blur",
      },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "产品状态",
    name: "state",
    type: "radio",
    rules: [
      {
        required: true,
        message: "请选择产品状态",
        trigger: "change",
      },
    ],
    formatter: (i: any) => {
      return formOptions.state[i.state];
    },
  },
  {
    title: "合约或现货限价单的单笔最大委托数量",
    name: "maxLmtSz",
    rules: [
      {
        required: true,
        message: "过去24小时内已用提币额度不能为空",
        trigger: "blur",
      },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "合约或现货市价单的单笔最大委托数量",
    name: "maxMktSz",
    rules: [
      {
        required: true,
        message: "过去24小时内提币额度不能为空",
        trigger: "blur",
      },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  { title: "备注", name: "remark" },
];

const searchNames = ["baseCcy", "quoteCcy", "instId", "instType", "state"];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  state: {
    closed: "关闭中",
    live: "交易中",
    suspend: "暂停中",
    preopen: "预上线",
    settlement: "资金费结算",
  },
  status: { true: "是", false: "否" },
};

export const titles = forms.map((i) => ({
  title: i.title,
  name: i.name,
  formatter: i.formatter,
}));
export const formtitles = forms.reduce((pre: any, i, k) => {
  const item = {
    title: i.title,
    name: i.name,
    type: i.type || "text",
  };
  return k % 2 === 0
    ? [...pre, [item]]
    : [...pre.slice(0, pre.length - 1), [pre[pre.length - 1][0], item]];
}, []);
export const rules = forms.reduce(
  (pre, i) => ({
    ...pre,
    [i.name]: i.rules || [],
  }),
  {}
);
export const formDefault = forms.reduce(
  (pre, i) => ({ ...pre, [i.name]: "" }),
  {}
);
export const searchDefault = formSearchs.reduce(
  (pre, i) => ({ ...pre, [i.name]: "" }),
  {}
);
