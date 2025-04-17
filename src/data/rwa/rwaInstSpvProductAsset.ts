import Pattern from "@/data/pattern";

export const forms = [
    {
        title: "用户ID",
        name: "userId",
    },
    {
        title: "机构投资者ID",
        name: "instInvestorId",
    },
    {
        title: "机构SPV产品ID",
        name: "instSpvProductId",
    },
    {
        title: "发行人持有量",
        name: "productAmount",
    },
    {
        title: "投资人持有量",
        name: "investorAmount",
    },
    {
        title: "总融资",
        name: "totalAmount",
        rules: [
            {
                required: true,
                trigger: "blur",
            },
        ],
    },
    {
        title: "已解冻",
        name: "amount",
        rules: [
            {
                required: true,
                trigger: "blur",
            },
        ],
    },
    {
        title: "申请解冻",
        name: "lastAmount",
        rules: [
            {
                required: true,
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
    "instSpvProductId",
    "state",
];
export const formSearchs = forms
    .filter((i) => searchNames.includes(i.name))
    .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
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
