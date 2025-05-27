import Pattern from "@/data/pattern";


export const forms = [
    {
        title: "产品类型",
        name: "instType",
        type: "radio",
        rules: [{ required: true, message: "产品类型不能为空", trigger: "blur" }],
        formatter: (i: any) => {
            return formOptions.instType[i.instType];
        },
    },
    {
        title: "产品ID",
        name: "instId",
        rules: [{ required: true, message: "产品ID不能为空", trigger: "blur" }],
    },
    {
        title: "区块链",
        name: "blockchain",
        rules: [
            { required: true, message: "区块链不能为空", trigger: "blur" },
            // {
            //   pattern: /^\d{1,2}$/,
            //   message: "提币精度为最多2位的整数",
            //   trigger: "blur",
            // },
        ],
    },
    {
        title: "币种中文名",
        name: "currencyName",
        rules: [
            {
                required: true,
                message: "币种中文名不能为空",
                trigger: "blur",
            },
        ],
    },
    {
        title: "资产总量",
        name: "currencyNum",
        rules: [
            { required: true, message: "资产总量不能为空", trigger: "blur" },
            {
                pattern: Pattern.amount,
                message: "请输入数字",
                trigger: "blur",
            },
        ],
    },
    {
        title: "资产合约",
        name: "currencyContract",
        rules: [{ required: true, message: "资产合约不能为空", trigger: "blur" }],
    },
    {
        title: "资产介绍",
        name: "currencyDesc",
        type: "textarea",
        rules: [{ required: false, message: "资产介绍不能为空", trigger: "blur" }],
    },
    {
        title: "项目简介",
        name: "currencyPmDesc",
        type: "textarea",
        rules: [
            { required: false, message: "项目简介不能为空" },
        ],
    },
    {
        title: "资产链接",
        name: "currencyLink",
        rules: [{ required: true, message: "资产链接不能为空", trigger: "blur" }],
    },
    {
        title: "项目网址",
        name: "currencySite",
        rules: [
            {
                required: true,
                message: "项目网址不能为空",
                trigger: "blur",
            },
        ],
    },
    {
        title: "区块浏览器",
        name: "currencyBrowser",
        rules: [{ required: true, message: "区块浏览器不能为空", trigger: "blur" }],
    },
    {
        title: "白皮书",
        name: "currencyWhitepaperUrl",
        rules: [{ required: true, message: "白皮书不能为空", trigger: "blur" }],
    },
    {
        title: "X",
        name: "currencyX",
        rules: [{ required: true, message: "X不能为空", trigger: "blur" }],
    },
    {
        title: "Telegram",
        name: "currencyTelegram",
        rules: [{ required: true, message: "Telegram不能为空", trigger: "blur" }],
    },
    {
        title: "Logo",
        name: "currencyLogoUrl",
        type: "uploading",
        rules: [{ required: true, message: "Logo不能为空", trigger: "blur" }],
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
