import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// userId	用户ID	integer(int64)
// instInvestorId	机构投资者ID	integer(int64)
// instSpvProductId	机构SPV产品ID	integer(int64)
// purchaseCurrency	申购币种	string
// purchasePrice	申购价格	number
// purchaseAmount	申购数量	number
// state	状态(成功success、处理中pending、失败failed)	string
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
    title: "机构投资者ID",
    name: "instInvestorId",
    rules: [
      { required: true, message: "机构投资者ID不能为空", trigger: "blur" },
    ],
  },
  {
    title: "机构SPV产品ID",
    name: "instSpvProductId",
    rules: [
      { required: true, message: "机构SPV产品ID不能为空", trigger: "blur" },
    ],
  },
  {
    title: "申购币种",
    name: "purchaseCurrency",
    rules: [{ required: true, message: "申购币种不能为空", trigger: "blur" }],
  },
  {
    title: "申购价格",
    name: "purchasePrice",
    rules: [
      {
        required: true,
        message: "申购价格不能为空",
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
    title: "申购数量",
    name: "purchaseAmount",
    rules: [
      {
        required: true,
        message: "申购数量不能为空",
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
  { title: "备注", name: "remark" },
];
const searchNames = [
  "userId",
  "instInvestorId",
  "instSpvProductId",
  "purchaseCurrency",
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
