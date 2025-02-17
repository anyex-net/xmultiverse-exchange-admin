import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// userId	用户ID	integer(int64)
// currency	币种(BTC、ETH、USDT)	string
// balance	余额	number
// frozenBal	冻结(不可用)	number
// availBal	可用余额	number
// remark	备注	string
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
    title: "余额",
    name: "balance",
    rules: [
      { required: true, message: "余额不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "冻结",
    name: "frozenBal",
    rules: [
      { required: true, message: "冻结不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "可用余额",
    name: "availBal",
    rules: [
      {
        required: true,
        message: "可用余额不能为空",
        trigger: "blur",
      },
    ],
  },
  { title: "备注", name: "remark" },
];

const searchNames = ["userId", "currency"];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title }));

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
