import Pattern from "@/data/pattern";

export const forms = [
    {
        title: "用户ID",
        name: "userId",
    },
    {
        title: "机构SPV产品ID",
        name: "instSpvProductId",
    },
    {
        title: "收入分成日期",
        name: "incomeDistributionDate",
    },
    {
        title: "收入金额",
        name: "incomeAmount",
    },
    {
        title: "收入币种",
        name: "incomeCurrency",
        rules: [
            {
                required: true,
                trigger: "blur",
            },
        ],
    },
    { title: "备注", name: "remark" },
];
const searchNames = [
    "userId",
    "instSpvProductId",
    "state",
];
export const formSearchs = forms
    .filter((i) => searchNames.includes(i.name))
    .map((i) => ({ name: i.name, title: i.title}));
export const formOptions: any = {
    state: { 0: "未审核", 1: "审核通过", 2: "已驳回" },
};

export const titles = forms.map((i) => ({
    title: i.title,
    name: i.name,
}));
export const formtitles = forms.reduce((pre: any, i, k) => {
    const item = {
        title: i.title,
        name: i.name,
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
