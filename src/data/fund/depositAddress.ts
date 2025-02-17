import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// userId	用户ID	integer(int64)
// currency	币种(BTC、ETH、USDT)	string
// blockchain	区块链(BTC、ETH、TRON、BSC)	string
// depositAddress	用户充值地址	string
// accDeposit	累计充值(包含未确认)	number
// unconfAccDeposit	未确认累计充值	number
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
    title: "累计充值(包含未确认)",
    name: "accDeposit",
    rules: [
      {
        required: true,
        message: "累计充值不能为空",
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
    title: "未确认累计充值",
    name: "unconfAccDeposit",
    rules: [
      { required: true, message: "未确认累计充值不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  { title: "备注", name: "remark" },
];
const searchNames = ["userId", "currency", "blockchain", "depositAddress"];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title }));
export const formOptions: any = {};

export const titles = forms.map((i) => ({
  title: i.title,
  name: i.name,
}));
export const formtitles = forms.reduce((pre: any, i, k) => {
  const item = {
    title: i.title,
    name: i.name,
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
