import Pattern from "@/data/pattern";
import Status from "@/data/status";

// id	记录唯一ID	integer(int64)
// currency	币种(BTC、ETH、USDT)	string
// currencyName	币种中文名	string
// blockchain	区块链(BTC、ETH、TRON、BSC)	string
// canDep	是否可充值 false表示不可链上充值 true表示可以链上充值	string
// canWd	是否可提币 false表示不可链上提币 true表示可以链上提币	string
// canInternal	是否可内部转账 false表示不可内部转账 true表示可以内部转账	string
// minWd	币种单笔最小提币量	number
// maxWd	币种单笔最大提币量	number
// wdTickSz	提币精度 表示小数点后的位数	integer(int32)
// wdQuota	过去24小时内提币额度	number
// usedWdQuota	过去24小时内已用提币额度	number
// minFee	最小提币手续费数量	number
// maxFee	最大提币手续费数量	number
// mainNet	当前链是否为主链 如果是则返回true 否则返回false	string
// state	币种状态 开放中live 关闭中closed	string
// remark	备注	string
// createTime	创建时间	integer(int64)
// updateBy	更新人	string
// updateTime	更新时间	integer(int64)
export const forms = [
  {
    title: "币种",
    name: "currency",
    rules: [{ required: true, message: "币种不能为空", trigger: "blur" }],
  },
  {
    title: "币种中文名",
    name: "currencyName",
    rules: [{ required: true, message: "币种中文名不能为空", trigger: "blur" }],
  },
  {
    title: "区块链",
    name: "blockchain",
    rules: [{ required: true, message: "区块链不能为空", trigger: "blur" }],
  },
  {
    title: "提币精度",
    name: "wdTickSz",
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
    title: "当前链是否为主链",
    name: "mainNet",
    type: "radio",
    rules: [
      {
        required: true,
        message: "请选择当前链是否为主链",
        trigger: "change",
      },
    ],
  },
  {
    title: "是否可内部转账",
    name: "canInternal",
    type: "radio",
    rules: [
      { required: true, message: "请选择是否可内部转账", trigger: "change" },
    ],
  },
  {
    title: "是否可充值",
    name: "canDep",
    type: "radio",
    rules: [{ required: true, message: "请选择是否可充值", trigger: "change" }],
  },
  {
    title: "是否可提币",
    name: "canWd",
    type: "radio",
    rules: [{ required: true, message: "请选择是否可提币", trigger: "change" }],
  },
  {
    title: "最大提币手续费",
    name: "maxFee",
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
    title: "最小提币手续费",
    name: "minFee",
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
    title: "币种单笔最大提币量",
    name: "maxWd",
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
    title: "币种单笔最小提币量",
    name: "minWd",
    rules: [
      {
        required: true,
        message: "币种单笔最小提币量不能为空",
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
    title: "过去24小时内已用提币额度",
    name: "usedWdQuota",
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
    title: "过去24小时内提币额度",
    name: "wdQuota",
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
  {
    title: "币种状态",
    name: "state",
    type: "radio",
    rules: [
      {
        required: true,
        message: "请选择币种状态",
        trigger: "change",
      },
    ],
    formatter: (i: any) => {
      return formOptions.state[i.state];
    },
  },
];
const searchNames = ["currency", "currencyName", "blockchain", "state"];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  state: { live: "开放中", closed: "关闭" },
  mainNet: Status.status,
  canInternal: Status.status,
  canDep: Status.status,
  canWd: Status.status,
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
