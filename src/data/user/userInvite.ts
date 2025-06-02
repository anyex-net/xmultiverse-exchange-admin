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
        title: "邀请方式",
        name: "inviteType",
        type: "radio",
        formatter: (i: any) => {
            return formOptions.inviteType[i.inviteType];
        },
    },
    {
        title: "使用的推荐码",
        name: "inviteCodeUsed",
    },
    {
        title: "是否为有效邀请",
        name: "isValid",
        type: "radio",
        formatter: (i: any) => {
            return formOptions.isValid[i.isValid];
        },
    },
];
const searchNames = ["userId", "userName", "systemName", "opType"];
export const formSearchs = forms
    .filter((i) => searchNames.includes(i.name))
    .map((i) => ({ name: i.name, title: i.title,type: i.type || "text",}));
export const formOptions: any = {
    inviteType: { "0": "链接邀请", "1": "推荐码邀请" },
    isValid: { 0: "否", 1: "是" },
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
