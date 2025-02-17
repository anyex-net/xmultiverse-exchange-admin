import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// userId	用户ID	integer(int64)
// currency	币种(BTC、ETH、USDT)	string
// blockchain	区块链(BTC、ETH、TRON、BSC)	string
// fromAddress	提地址	string
// toAddress	收地址	string
// amount	提现数量	number
// fee	提现手续费	number
// transId	交易ID	string
// state	提现状态(canceled已撤销、applied已申请、checked已复核、exported已汇出)	string
// remark	备注	string
// createTime	创建时间	integer(int64)
// updateBy	更新人	string
// updateTime	更新时间	integer(int64)
// checkBy	复核人	string
// checkTime	复核时间	integer(int64)

export const forms = [
  {
    title: "用户ID",
    name: "userId",
    rules: [{ required: true, message: "用户ID不能为空", trigger: "blur" }],
  },
  {
    title: "币种",
    name: "currency",
    rules: [{ required: true, message: "币种不能为空", trigger: "blur" }],
  },
  {
    title: "区块链",
    name: "blockchain",
    rules: [{ required: true, message: "区块链不能为空", trigger: "blur" }],
  },
  {
    title: "提地址",
    name: "fromAddress",
    rules: [{ required: true, message: "提地址不能为空", trigger: "blur" }],
  },
  {
    title: "收地址",
    name: "toAddress",
    rules: [
      {
        required: true,
        message: "收地址不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "提现数量",
    name: "amount",
    rules: [
      { required: true, message: "提现数量不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "提现手续费",
    name: "fee",
    rules: [
      {
        required: true,
        message: "提现手续费不能为空",
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
    title: "交易ID",
    name: "transId",
    rules: [
      {
        required: true,
        message: "交易ID不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "提现状态",
    name: "state",
    type: "radio",
    rules: [
      {
        required: true,
        message: "请选择状态",
        trigger: "change",
      },
    ],
  },
  {
    title: "复核人",
    name: "checkBy",
    rules: [
      {
        required: true,
        message: "复核人不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "复核时间",
    name: "checkTime",
    rules: [
      {
        required: true,
        message: "checkTime不能为空",
        trigger: "blur",
      },
    ],
  },
  { title: "备注", name: "remark" },
];

const searchNames = [
  "userId",
  "currency",
  "blockchain",
  "fromAddress",
  "toAddress",
  "transId",
  "state",
];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  state: {
    canceled: "已撤销",
    applied: "已申请",
    checked: "已复核",
    exported: "已汇出",
  },
};

export const titles = forms.map((i) => ({
  title: i.title,
  name: i.name,
}));
export const formtitles = forms.reduce((pre: any, i, k) => {
  const item = {
    title: i.title,
    name: i.name,
    type: i.type,
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
