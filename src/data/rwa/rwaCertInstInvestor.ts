import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// userId 用户ID integer(int64)
// agentName	代理人姓名	string
// agentRegion	代理人国家地区	string
// agentPassportType	代理人证件类型	string
// agentPassportNo	代理人证件号码	string
// agentPassportImg1	代理人证件照片1	string
// agentPassportImg2	代理人证件照片2	string
// agentPassportImg3	代理人证件照片3	string
// agentEmail	代理人联系邮箱	string
// agentMobileNo	代理人联系电话	string
// agentAuthorizationFile	代理人授权文件	string
// companyName	公司名称	string
// companyType	公司类型	string
// companyBusinessType	公司业务类型	string
// companyRegistrNo	公司注册编号	string
// companyRegistrImg	公司注册证书图片	string
// companyCountry	公司所在国家地区	string
// companyRegistrAddress	公司注册地址	string
// companyFoundedDate	公司成立日期	string(date-time)
// companyLicenseNumber	公司持牌编号	string
// companyRegulator	公司监管机构	string
// companyAmlCertificate	公司AML反洗钱证明	string
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
    title: "代理人姓名",
    name: "agentName",
    rules: [{ required: true, message: "代理人姓名不能为空", trigger: "blur" }],
  },
  {
    title: "代理人国家地区",
    name: "agentRegion",
    rules: [
      { required: true, message: "代理人国家地区不能为空", trigger: "blur" },
    ],
  },
  {
    title: "代理人证件类型",
    name: "agentPassportType",
    rules: [
      { required: true, message: "代理人证件类型不能为空", trigger: "blur" },
    ],
  },
  {
    title: "代理人证件号码",
    name: "agentPassportNo",
    rules: [
      { required: true, message: "代理人证件号码不能为空", trigger: "blur" },
    ],
  },
  {
    title: "代理人证件照片1",
    name: "agentPassportImg1",
    rules: [
      { required: true, message: "代理人证件照片1不能为空", trigger: "blur" },
    ],
  },
  {
    title: "代理人证件照片2",
    name: "agentPassportImg2",
    rules: [
      { required: true, message: "代理人证件照片2不能为空", trigger: "blur" },
    ],
  },
  {
    title: "代理人证件照片3",
    name: "agentPassportImg3",
    rules: [
      { required: true, message: "代理人证件照片3不能为空", trigger: "blur" },
    ],
  },
  {
    title: "代理人联系邮箱",
    name: "agentEmail",
    rules: [
      {
        required: true,
        message: "代理人联系邮箱不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "代理人联系电话",
    name: "agentMobileNo",
    rules: [
      {
        required: true,
        message: "代理人联系电话不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "代理人授权文件",
    name: "agentAuthorizationFile",
    rules: [
      { required: true, message: "代理人授权文件不能为空", trigger: "blur" },
    ],
  },
  {
    title: "公司名称",
    name: "companyName",
    rules: [{ required: true, message: "公司名称不能为空", trigger: "blur" }],
  },
  {
    title: "公司类型",
    name: "companyType",
    rules: [{ required: true, message: "公司类型不能为空", trigger: "blur" }],
  },
  {
    title: "公司业务类型",
    name: "companyBusinessType",
    rules: [
      { required: true, message: "公司业务类型不能为空", trigger: "blur" },
    ],
  },
  {
    title: "公司注册编号",
    name: "companyRegistrNo",
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
    name: "companyRegistrImg",
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
    name: "companyCountry",
    rules: [
      {
        required: true,
        message: "公司所在国家地区不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司注册地址",
    name: "companyRegistrAddress",
    rules: [
      {
        required: true,
        message: "公司注册地址不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司成立日期",
    name: "companyFoundedDate",
    rules: [
      {
        required: true,
        message: "公司成立日期不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司持牌编号",
    name: "companyLicenseNumber",
    rules: [
      {
        required: true,
        message: "公司持牌编号不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司监管机构",
    name: "companyRegulator",
    rules: [
      {
        required: true,
        message: "公司监管机构不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司AML反洗钱证明",
    name: "companyAmlCertificate",
    rules: [
      {
        required: true,
        message: "公司AML反洗钱证明不能为空",
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
    formatter: (i: any) => {
      return formOptions.state[i.state];
    },
  },
  {
    title: "复核人",
    name: "checkBy",
    rules: [
      {
        required: true,
        message: "复核人不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "复核时间",
    name: "checkTime",
    rules: [
      {
        required: true,
        message: "checkTime不能为空",
        trigger: "blur",
      },
    ],
  },
  { title: "备注", name: "remark" },
];

const searchNames = [
  "userId",
  "agentName",
  "agentPassportNo",
  "agentMobileNo",
  "companyName",
  "companyRegistrNo",
  "state",
];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  state: { 0: "未审核", 1: "审核通过", 2: "审核拒绝" },
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
