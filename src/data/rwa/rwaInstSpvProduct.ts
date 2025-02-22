import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// userId	用户ID	integer(int64)
// instSpvPromoterId	机构SPV发起人ID	integer(int64)
// instSpvCompanyId	机构SPV公司ID	integer(int64)
// productNo	产品编号	string
// tokenName	代币名称	string
// tokenLogo	代币Logo	string
// tokenIssueNumber	代币发行数量	number
// raiseCurrency	募集币种	string
// raiseAmount	募集金额	number
// assetEndValuation	资产期末估值, 预估收益率=(期末估值-募集金额)/募集金额	number
// issueDays	发行天数	integer(int32)
// purchaseStartDate	申购开始日期	string(date-time)
// purchaseEndDate	申购结束日期	string(date-time)
// operationStarDate	运营开始日期	string(date-time)
// operationEndDate	运营结束日期	string(date-time)
// raiseEstablishedRatio	募集成立条件比例	number
// companyAssetName	公司资产名称	string
// companyAssetDesc	公司资产描述	string
// companyRaiseUse	公司募集用途	string
// dividendRatio	分红比例	number
// dividendFrequency	分红频率	string
// dividendFreezeDays	分红冻结天数	integer(int32)
// raiseMarginRatio	募集对应保证金比例	number
// raiseMarginState	募集对应保证金状态(0未缴、1已缴)	integer(int32)
// purchasedSumAmount	已申购总数量	number
// state	状态(0未审核、1审核通过、2审核拒绝、3合约部署中、4待开放、5申购中、6发行失败、7运营中、8已到期)	string
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
    title: "机构SPV公司ID",
    name: "instSpvCompanyId",
    rules: [
      { required: true, message: "机构SPV公司ID不能为空", trigger: "blur" },
    ],
  },
  {
    title: "产品编号",
    name: "productNo",
    rules: [{ required: true, message: "产品编号不能为空", trigger: "blur" }],
  },
  {
    title: "代币名称",
    name: "tokenName",
    rules: [
      {
        required: true,
        message: "代币名称不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "代币Logo",
    name: "tokenLogo",
    rules: [{ required: true, message: "代币Logo不能为空", trigger: "blur" }],
  },
  {
    title: "代币发行数量",
    name: "tokenIssueNumber",
    rules: [
      {
        required: true,
        message: "代币发行数量不能为空",
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
    title: "募集币种",
    name: "raiseCurrency",
    rules: [
      {
        required: true,
        message: "募集币种不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "募集金额",
    name: "raiseAmount",
    rules: [
      {
        required: true,
        message: "募集金额不能为空",
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
    title: "资产期末估值",
    name: "assetEndValuation",
    rules: [
      {
        required: true,
        message: "资产期末估值不能为空",
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
    title: "发行天数",
    name: "issueDays",
    rules: [
      {
        required: true,
        message: "发行天数不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "申购开始日期",
    name: "purchaseStartDate",
    rules: [
      {
        required: true,
        message: "申购开始日期不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "申购结束日期",
    name: "purchaseEndDate",
    rules: [
      {
        required: true,
        message: "申购结束日期不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "运营开始日期",
    name: "operationStarDate",
    rules: [
      {
        required: true,
        message: "运营开始日期不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "运营结束日期",
    name: "operationEndDate",
    rules: [
      {
        required: true,
        message: "运营结束日期不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "募集成立条件比例",
    name: "raiseEstablishedRatio",
    rules: [
      {
        required: true,
        message: "募集成立条件比例不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司资产名称",
    name: "companyAssetName",
    rules: [
      {
        required: true,
        message: "公司资产名称不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司资产描述",
    name: "companyAssetDesc",
    rules: [
      {
        required: true,
        message: "公司资产描述不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "公司募集用途",
    name: "companyRaiseUse",
    rules: [
      {
        required: true,
        message: "公司募集用途不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "分红比例",
    name: "dividendRatio",
    rules: [
      {
        required: true,
        message: "分红比例不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "分红频率",
    name: "dividendFrequency",
    rules: [
      {
        required: true,
        message: "分红频率不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "分红冻结天数",
    name: "dividendFreezeDays",
    rules: [
      {
        required: true,
        message: "分红冻结天数不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "募集对应保证金比例",
    name: "raiseMarginRatio",
    rules: [
      {
        required: true,
        message: "募集对应保证金比例不能为空",
        trigger: "blur",
      },
    ],
  },
  {
    title: "募集对应保证金状态",
    name: "raiseMarginState",
    type: "radio",
    rules: [
      {
        required: true,
        message: "请选择状态",
        trigger: "change",
      },
    ],
    formatter: (i: any) => {
      return formOptions.raiseMarginState[i.raiseMarginState];
    },
  },
  {
    title: "已申购总数量",
    name: "purchasedSumAmount",
    rules: [
      {
        required: true,
        message: "已申购总数量不能为空",
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
  { title: "备注", name: "remark" },
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
];
const searchNames = [
  "userId",
  "instSpvPromoterId",
  "instSpvCompanyId",
  "productNo",
  "raiseMarginState",
  "state",
];
export const formSearchs = forms
  .filter((i) => searchNames.includes(i.name))
  .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
  state: {
    0: "未审核",
    1: "审核通过",
    2: "审核拒绝",
    3: "合约部署中",
    4: "待开放",
    5: "申购中",
    6: "发行失败",
    7: "运营中",
    8: "已到期",
  },
  raiseMarginState: {
    0: "未缴",
    1: "已缴",
  },
};

export const titles = forms.map((i) => ({
  title: i.title,
  name: i.name,
  formatter: i.formatter
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
