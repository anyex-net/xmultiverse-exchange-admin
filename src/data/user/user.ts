import Pattern from "@/data/pattern";

// uid	UID	integer(int64)
// userName	用户名	string
// avatar	用户头像	string
// loginPwd	登录密码	string
// tradePwd	交易密码	string
// email	邮箱	string
// country	国家地区	string
// mobileNo	手机号	string
// gaAuthKey	Google验证器私钥	string
// location	注册所在地或IP	string
// state	状态(0:正常、1:冻结、2:注销)	string
// thawTime	解冻时间	integer(int64)
// securityPolicy	安全验证策略	integer(int32)
// tradePolicy	交易验证策略	integer(int32)
// inviteCode	邀请码	string
// referralCode	推荐码	string
// source	来源web、app	string
// riskEvaluation	是否风评	integer(int32)
// certState	认证状态(0:未认证、1:已认证个人KYC、2:已认证机构投资者、3:已认证机构SPV发起人)	integer(int32)
// lang	语言	string
// localCurrency	本地货币	string
// stableCoinPreference	稳定币偏好	string
// remark	备注	string
// createTime	创建时间	integer(int64)
// updateBy	更新人	string
// updateTime	更新时间	integer(int64)

export const forms = [
  {
    title: "UID",
    name: "uid",
    rules: [{ required: true, message: "UID不能为空", trigger: "blur" }],
  },
  {
    title: "用户名",
    name: "userName",
    rules: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  },
  {
    title: "用户头像",
    name: "avatar",
    rules: [{ required: true, message: "用户头像不能为空", trigger: "blur" }],
  },
  {
    title: "邮箱",
    name: "email",
    rules: [
      { required: true, message: "邮箱不能为空", trigger: "blur" },
      {
        pattern: Pattern.email,
        message: "请输入邮箱",
        trigger: "blur",
      },
    ],
  },
  {
    title: "国家地区",
    name: "country",
    rules: [
      {
        required: true,
        message: "国家地区不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "手机号",
    name: "mobileNo",
    rules: [
      { required: true, message: "手机号不能为空", trigger: "blur" },
      {
        pattern: Pattern.phone,
        message: "请输入手机号",
        trigger: "blur",
      },
    ],
  },
  {
    title: "注册所在地或IP",
    name: "location",
    rules: [
      { required: true, message: "注册所在地或IP不能为空", trigger: "blur" },
    ],
  },
  {
    title: "状态",
    name: "state",
    type: "radio",
    rules: [{ required: true, message: "请选择", trigger: "change" }],
    formatter: (i: any) => {
      return formOptions.state[i.state];
    },
  },
  {
    title: "解冻时间",
    name: "thawTime",
    rules: [{ required: true, message: "解冻时间不能为空", trigger: "blur" }],
  },
  {
    title: "安全验证策略",
    name: "securityPolicy",
    rules: [
      { required: true, message: "安全验证策略不能为空", trigger: "blur" },
    ],
  },
  {
    title: "交易验证策略",
    name: "tradePolicy",
    rules: [
      { required: true, message: "交易验证策略不能为空", trigger: "blur" },
    ],
  },
  {
    title: "邀请码",
    name: "inviteCode",
    rules: [{ required: true, message: "邀请码不能为空", trigger: "blur" }],
  },
  {
    title: "推荐码",
    name: "referralCode",
    rules: [{ required: true, message: "推荐码不能为空", trigger: "blur" }],
  },
  {
    title: "来源",
    name: "source",
    rules: [
      {
        required: true,
        message: "来源不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "认证状态",
    name: "certState",
    type: "radio",
    rules: [
      {
        required: true,
        message: "请选择",
        trigger: "change",
      },
    ],
    formatter: (i: any) => {
      return formOptions.certState[i.certState];
    },
  },
  {
    title: "语言",
    name: "lang",
    rules: [
      {
        required: true,
        message: "语言不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "本地货币",
    name: "localCurrency",
    rules: [
      {
        required: true,
        message: "本地货币不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "稳定币偏好",
    name: "stableCoinPreference",
    rules: [
      {
        required: true,
        message: "稳定币偏好不能为空",
        trigger: "blur",
      },
    ],
  },
  { title: "备注", name: "remark" },
];
const searchNames = [
  "uid",
  "userName",
  "email",
  "mobileNo",
  "state",
  "certState",
];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  state: { 0: "正常", 1: "冻结", 2: "注销" },
  certState: {
    '0': "未认证",
    1: "已认证个人KYC",
    2: "已认证机构投资者",
    3: "已认证机构SPV发起人",
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
