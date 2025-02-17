import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// userId	用户ID	integer(int64)
// currency	币种(BTC、ETH、USDT)	string
// type	类型(转入、转出、冻结、解冻、申购、分红)	string
// beforeBal	前余额	number
// changeAmt	发生数量	number
// afterBal	后余额	number
// businessId	原业务ID	string
// fromAcct	转出账户	string
// toAcct	转入账户	string
// state	状态(成功success、处理中pending、失败failed)	string
// transDesc	交易描述	string
// remark	备注	string
// createTime	创建时间	integer(int64)

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
    title: "类型",
    name: "type",
    rules: [{ required: true, message: "类型不能为空", trigger: "blur" }],
  },
  {
    title: "前余额",
    name: "beforeBal",
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
    title: "发生数量",
    name: "changeAmt",
    rules: [
      {
        required: true,
        message: "发生数量不能为空",
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
    title: "后余额",
    name: "afterBal",
    rules: [
      { required: true, message: "后余额不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "原业务ID",
    name: "businessId",
    rules: [
      {
        required: true,
        message: "原业务ID不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "转出账户",
    name: "fromAcct",
    rules: [
      {
        required: true,
        message: "转出账户不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "转入账户",
    name: "toAcct",
    rules: [
      {
        required: true,
        message: "转入账户不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "状态",
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
    title: "交易描述",
    name: "transDesc",
    rules: [
      {
        required: true,
        message: "交易描述不能为空",
        trigger: "blur",
      },
    ],
  },
  { title: "备注", name: "remark" },
];

const searchNames = [
  "userId",
  "currency",
  "type",
  "fromAcct",
  "toAcct",
  "state",
];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  state: { success: "成功", pending: "处理中", failed: "失败" },
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
