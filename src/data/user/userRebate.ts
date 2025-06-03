import Pattern from "@/data/pattern";

export const forms = [
    {
        title: "邀请人用户ID",
        name: "inviterId",
        rules: [{ required: true, message: "用户ID不能为空", trigger: "blur" }],
    },
    {
        title: "被邀请人用户ID",
        name: "inviteeId",
    },
    {
        title: "关联交易ID",
        name: "tradeId",
    },
    {
        title: "交易对",
        name: "symbol",
    },
    {
        title: "交易方向",
        name: "tradeSide",
         type: "radio",
        formatter: (i: any) => {
            return formOptions.tradeSide[i.tradeSide];
        },
    },
    {
        title: "交易金额",
        name: "tradeAmount",
    },
    {
        title: "手续费金额",
        name: "feeAmount",
    },
    {
        title: "返佣比例",
        name: "rebateRate",
    },
    {
        title: "换算汇率",
        name: "priceUSDT",
    },
    {
        title: "实际返佣金额",
        name: "rebateAmount",
    },
    {
        title: "状态",
        name: "status",
        type: "radio",
        formatter: (i: any) => {
            return formOptions.status[i.status];
        },
    },
    {
        title: "结算日期",
        name: "settleDate",
    }
];
const searchNames = ["inviterId", "inviteeId", "symbol", "tradeSide","status"];
export const formSearchs = forms
    .filter((i) => searchNames.includes(i.name))
    .map((i) => ({ name: i.name, title: i.title,type: i.type || "text",}));
export const formOptions: any = {
    tradeSide: { "1": "买", "2": "卖" },
    status: { "pending": "结算中", "settled": "已结算"},
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
