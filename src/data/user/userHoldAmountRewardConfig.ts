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
        title: "持有数量1(起)",
        name: "holdAmount1",
        rules: [{ required: true, message: "持有数量1(起)不能为空", trigger: "blur" }],
    },
    {
        title: "持有数量2(终)",
        name: "holdAmount2",
        rules: [
            { required: true, message: "持有数量2(终)不能为空", trigger: "blur" },
        ],
    },
    {
        title: "持有等级",
        name: "holdLevel",
        rules: [
            {
                required: true,
                message: "持有等级不能为空",
                trigger: "blur",
            },
        ],
    },
    {
        title: "持有对应交易手续费费率折扣",
        name: "holdRateDiscount",
        rules: [
            { required: true, message: "持有对应交易手续费费率折扣不能为空", trigger: "blur" },
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
