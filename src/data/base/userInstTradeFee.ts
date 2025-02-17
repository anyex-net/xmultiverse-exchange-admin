import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// instType	产品类型 币币SPOT 币币杠杆MARGIN 永续合约SWAP 交割合约FUTURES 期权OPTION	string
// instId	产品Id 如BTC-USD-SWAP	string
// uly	标的指数 仅适用于instType为交割/永续/期权 如BTC-USD	string
// taker	吃单手续费率 永续和交割合约时 为币本位U本位合约费率	number
// maker	挂单手续费率 永续和交割合约时 为币本位U本位合约费率	number
// delivery	交割手续费率	number
// exercise	行权手续费率	number
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
    title: "产品类型",
    name: "instType",
    type: "radio",
    rules: [{ required: true, message: "请选择", trigger: "blur" }],
    formatter: (i: any) => {
      return formOptions.instType[i.instType];
    },
  },
  {
    title: "产品ID",
    name: "instId",
    rules: [{ required: true, message: "产品Id不能为空", trigger: "blur" }],
  },
  {
    title: "标的指数",
    name: "uly",
    rules: [
      {
        required: true,
        message: "产品类型不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "手续费等级",
    name: "level",
    rules: [{ required: true, message: "手续费等级不能为空", trigger: "blur" }],
  },
  {
    title: "吃单手续费率",
    name: "taker",
    rules: [
      { required: true, message: "吃单手续费率不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "挂单手续费率",
    name: "maker",
    rules: [
      { required: true, message: "挂单手续费率不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "交割手续费率",
    name: "delivery",
    rules: [
      { required: true, message: "交割手续费率不能为空", trigger: "blur" },
      {
        pattern: Pattern.amount,
        message: "请输入数字",
        trigger: "blur",
      },
    ],
  },
  {
    title: "行权手续费率",
    name: "exercise",
    rules: [
      {
        required: true,
        message: "行权手续费率不能为空",
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

const searchNames = ["userId", "instType", "instId", "level"];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  instType: {
    SPOT: "币币",
    MARGIN: "永续合约",
    SWAP: "暂停中",
    FUTURES: "交割合约",
    OPTION: "期权",
  },
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
