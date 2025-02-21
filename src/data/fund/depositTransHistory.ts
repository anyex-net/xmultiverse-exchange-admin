import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// userId	用户ID	integer(int64)
// currency	币种(BTC、ETH、USDT)	string
// blockchain	区块链(BTC、ETH、TRON、BSC)	string
// depositAddress	用户充值地址	string
// transId	交易ID	string
// amount	充值数量	number
// netFee	网络手续费	number
// confirmState	确认状态(unconfirm未确认、confirmed已确认)	string
// depositState	充值入账状态(undeposit未入账、deposited已入账)	string
// remark	备注	string
// createTime	创建时间	integer(int64)
// updateBy	更新人	string
// updateTime	更新时间	integer(int64)

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
    title: "用户充值地址",
    name: "depositAddress",
    rules: [
      { required: true, message: "用户充值地址不能为空", trigger: "blur" },
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
    title: "充值数量",
    name: "amount",
    rules: [
      { required: true, message: "充值数量不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "网络手续费",
    name: "netFee",
    rules: [
      {
        required: true,
        message: "网络手续费不能为空",
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
    title: "确认状态",
    name: "confirmState",
    type: "radio",
    rules: [
      {
        required: true,
        message: "请选择状态",
        trigger: "change",
      },
    ],
    formatter: (i: any) => {
      return formOptions.confirmState[i.confirmState];
    },
  },
  {
    title: "充值入账状态",
    name: "depositState",
    type: "radio",
    rules: [
      {
        required: true,
        message: "请选择状态",
        trigger: "change",
      },
    ],
    formatter: (i: any) => {
      return formOptions.depositState[i.depositState];
    },
  },
  { title: "备注", name: "remark" },
];

const searchNames = [
  "userId",
  "currency",
  "blockchain",
  "depositAddress",
  "transId",
  "confirmState",
  "depositState",
];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  confirmState: { unconfirm: "未确认", confirmed: "已确认" },
  depositState: { undeposit: "未入账", deposited: "已入账" },
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
