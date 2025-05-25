import Pattern from "@/data/pattern";

export const forms = [
    {
        title: "用户ID",
        name: "userId",
        rules: [{ required: true, message: "用户ID不能为空", trigger: "blur" }],
    },
    {
        title: "密钥类型",
        name: "keyType",
        type: "radio",
        rules: [{ required: true, message: "请选择", trigger: "change" }],
        formatter: (i: any) => {
            return formOptions.keyType[i.keyType];
        },
    },
    {
        title: "apiKey",
        name: "apiKey",
        rules: [{ required: true, message: "apiKey不能为空", trigger: "blur" }],
    },
    {
        title: "公钥",
        name: "pubKey",
        rules: [
            { required: true, message: "公钥不能为空", trigger: "blur" },
        ],
    },
    {
        title: "私钥",
        name: "priKey",
        rules: [
            {
                required: true,
                message: "私钥不能为空",
                trigger: "blur",
            },
        ],
    },
    {
        title: "过期时间",
        name: "closeTime",
        rules: [
            { required: true, message: "过期时间不能为空", trigger: "blur" },
        ],
    },
    {
        title: "ip地址",
        name: "ipGroup",
        rules: [
            { required: true, message: "ip地址不能为空", trigger: "blur" },
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
    "keyType",
    "state",
];
export const formSearchs = forms
    .filter((i) => searchNames.includes(i.name))
    .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
    state: { 0: "不可用", 1: "可用"},
    keyType: {
        0: "只读",
        1: "交易",
        2: "提币",
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
