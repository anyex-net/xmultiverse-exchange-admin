import Pattern from "@/data/pattern";

export const forms = [
    {
        title: "用户ID",
        name: "userId",
        rules: [{ required: true, message: "用户ID不能为空", trigger: "blur" }],
    },
    {
        title: "产品ID",
        name: "instId",
        rules: [
            { required: true, message: "产品ID不能为空", trigger: "blur" },
            // {
            //   pattern: /^\d{1,2}$/,
            //   message: "提币精度为最多2位的整数",
            //   trigger: "blur",
            // },
        ],
    },
    {
        title: "产品类型",
        name: "instType",
        type: "radio",
        rules: [
            {
                required: true,
                message: "产品类型不能为空",
                trigger: "blur",
            },
        ],
        formatter: (i: any) => {
            return formOptions.instType[i.instType];
        },
    },
    { title: "备注", name: "remark" },
];

const searchNames = ["baseCcy", "quoteCcy", "instId", "instType", "state"];
export const formSearchs = forms
    .filter((i) => searchNames.includes(i.name))
    .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
    instType: {
        SPOT: "币币",
        MARGIN: "币币杠杆",
        SWAP: "永续合约",
        FUTURES: "交割合约",
        OPTION: "期权",
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
