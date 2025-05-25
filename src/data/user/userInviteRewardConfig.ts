import Pattern from "@/data/pattern";

export const forms = [
    {
        title: "币种",
        name: "currency",
        type: "radio",
        rules: [{ required: true, message: "请选择", trigger: "change" }],
        formatter: (i: any) => {
            return formOptions.currency[i.currency];
        },
    },
    {
        title: "交易手续费累积1(起)",
        name: "tradeFeeSum1",
        rules: [{ required: true, message: "交易手续费累积1(起)不能为空", trigger: "blur" }],
    },
    {
        title: "交易手续费累积2(终)",
        name: "tradeFeeSum2",
        rules: [
            { required: true, message: "交易手续费累积2(终)不能为空", trigger: "blur" },
        ],
    },
    {
        title: "奖励等级",
        name: "rewardLevel",
        rules: [
            {
                required: true,
                message: "奖励等级不能为空",
                trigger: "blur",
            },
        ],
    },
    {
        title: "奖励折扣(交易手续费)",
        name: "rewardDiscount",
        rules: [
            { required: true, message: "奖励折扣(交易手续费)不能为空", trigger: "blur" },
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
    { title: "备注", name: "remark" },
];
const searchNames = [
    "currency",
    "state",
];
export const formSearchs = forms
    .filter((i) => searchNames.includes(i.name))
    .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
    state: { 0: "不可用", 1: "可用"},
    currency: {
        "BTC": "BTC",
        "ETH": "ETH",
        "USDT": "USDT",
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
