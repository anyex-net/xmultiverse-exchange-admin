import Pattern from "@/data/pattern";

// userId	用户ID	integer(int64)
// surName	姓氏	string
// realName	名字	string
// region	国家地区	string
// passportType	证件类型	string
// passportNo	证件号码	string
// passportImg1	证件照片1	string
// passportImg2	证件照片2	string
// passportImg3	证件照片3	string
// state	状态(0未审核、1审核通过、2审核拒绝)	integer(int32)
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
    title: "姓氏",
    name: "surName",
    rules: [{ required: true, message: "姓氏不能为空", trigger: "blur" }],
  },
  {
    title: "名字",
    name: "realName",
    rules: [{ required: true, message: "名字不能为空", trigger: "blur" }],
  },
  {
    title: "国家地区",
    name: "region",
    rules: [{ required: true, message: "国家地区不能为空", trigger: "blur" }],
  },
  {
    title: "证件类型",
    name: "passportType",
    rules: [{ required: true, message: "证件类型不能为空", trigger: "blur" }],
    formatter: (i: any) => {
      return formOptions.passportType[i.passportType];
    },
  },
  // {
  //   title: "证件照片1",
  //   name: "passportImg1",
  //   rules: [{ required: true, message: "证件照片1不能为空", trigger: "blur" }],
  // },
  // {
  //   title: "证件照片2",
  //   name: "passportImg2",
  //   rules: [{ required: true, message: "证件照片2不能为空", trigger: "blur" }],
  // },
  // {
  //   title: "证件照片3",
  //   name: "passportImg3",
  //   rules: [{ required: true, message: "证件照片3不能为空", trigger: "blur" }],
  // },
  {
    title: "状态",
    name: "state",
    type: "radio",
    rules: [
      {
        required: true,
        message: "请选择",
        trigger: "change",
      },
    ],
    formatter: (i: any) => {
      return formOptions.state[i.state];
    },
  },
  // { title: "备注", name: "remark" },
];
const searchNames = ["userId", "surName", "realName", "passportType", "state"];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  state: { 0: "未审核", 1: "审核通过", 2: "审核拒绝" },
  passportType: {  "IdentityCard": "身份证", "Passport": "护照"}
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
