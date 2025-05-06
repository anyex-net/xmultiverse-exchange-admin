import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// userId	用户ID	integer(int64)
// instSpvPromoterId	机构SPV发起人ID	integer(int64)
// spvCompanyName	公司名称	string
// spvCompanyType	公司类型	string
// spvCompanyIndustry	公司行业	string
// spvCompanyRegistrNo	公司注册编号	string
// spvCompanyRegistrImg	公司注册证书图片	string
// spvCompanyCountry	公司所在国家地区	string
// spvCompanyEmail	公司联系邮箱	string
// spvCompanyMobileNo	公司联系电话	string
// spvCompanyAddress	公司地址	string
// spvCompanyDesc	公司介绍	string
// state	状态(0未审核、1审核通过、2审核拒绝)	string
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
    title: "机构SPV发起人ID",
    name: "instSpvPromoterId",
    rules: [
      { required: true, message: "机构SPV发起人ID不能为空", trigger: "blur" },
    ],
  },
  {
    title: "公司名称",
    name: "spvCompanyName",
    rules: [{ required: true, message: "公司名称不能为空", trigger: "blur" }],
  },
  {
    title: "公司类型",
    name: "spvCompanyType",
    rules: [{ required: true, message: "公司类型不能为空", trigger: "blur" }],
    formatter: (i: any) => {
      return formOptions.spvCompanyType[i.spvCompanyType];
    },
  },
  {
    title: "公司行业",
    name: "spvCompanyIndustry",
    rules: [{ required: true, message: "公司行业不能为空", trigger: "blur" }],
  },
  {
    title: "公司注册编号",
    name: "spvCompanyRegistrNo",
    rules: [
      {
        required: true,
        message: "公司注册编号不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司注册证书图片",
    name: "spvCompanyRegistrImg",
    rules: [
      {
        required: true,
        message: "公司注册证书图片不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司所在国家地区",
    name: "spvCompanyCountry",
    rules: [
      {
        required: true,
        message: "公司所在国家地区不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司联系邮箱",
    name: "spvCompanyEmail",
    rules: [
      {
        required: true,
        message: "公司联系邮箱不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司联系电话",
    name: "spvCompanyMobileNo",
    rules: [
      {
        required: true,
        message: "公司联系电话不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司地址",
    name: "spvCompanyAddress",
    rules: [
      {
        required: true,
        message: "公司地址不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司介绍",
    name: "spvCompanyDesc",
    rules: [
      {
        required: true,
        message: "公司介绍不能为空",
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
  "spvCompanyRegistrNo",
  "spvCompanyMobileNo",
  "state",
];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  state: { 0: "未审核", 1: "审核通过", 2: "审核拒绝" },
  spvCompanyType: { "0": "私营企业", "1": "上市企业", "2": "持牌金融机构" },
  spvCompanyIndustry: { "0": "互联网/IT/电子/通信", "1": "房地产/建筑", "2": "金融业","3": "教育培训/科研" },
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
