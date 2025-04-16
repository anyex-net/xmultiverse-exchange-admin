import Pattern from "@/data/pattern";

export const forms = [
  {
    title: "用户ID",
    name: "userId",
    rules: [{ required: true, message: "用户ID不能为空", trigger: "blur" }],
  },
  {
    title: "用户名字",
    name: "userName",
  },
  {
    title: "系统名称",
    name: "systemName",
  },
  {
    title: "操作类型",
    name: "opType",
    type: "radio",
    formatter: (i: any) => {
      return formOptions.opType[i.opType];
    },
  },
  {
    title: "IP地址",
    name: "ipAddr",
  },
  {
    title: "证件号码",
    name: "rigonName",
  },
  {
    title: "URL地址",
    name: "url",
  },
  {
    title: "内容",
    name: "content",
  },
  {
    title: "备注",
    name: "remark",
  },
  // { title: "备注", name: "remark" },
];
const searchNames = ["userId", "userName", "systemName", "opType"];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title,type: i.type || "text",}));
export const formOptions: any = {
  opType: { login: "登录", setting: "安全设置" },
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
