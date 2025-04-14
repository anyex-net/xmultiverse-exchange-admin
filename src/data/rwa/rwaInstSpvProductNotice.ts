import Pattern from "@/data/pattern";

// id	记录唯一ID	integer(int64)
// userId	用户ID	integer(int64)
// instInvestorId	机构投资者ID	integer(int64)
// instSpvProductId	机构SPV产品ID	integer(int64)
// dividendCurrency	分红币种	string
// dividendAmount	分红金额	number
// state	状态(成功success、处理中pending、失败failed)	string
// remark	备注	string
// createTime	创建时间	integer(int64)
// updateBy	更新人	string
// updateTime	更新时间	integer(int64)

export const forms = [
    {
        title: "用户ID",
        name: "userId",
        rules: [{ required: true, message: "用户ID不能为空", trigger: "blur" }],
    },
    {
        title: "机构投资者ID",
        name: "instInvestorId",
        rules: [
            { required: true, message: "机构投资者ID不能为空", trigger: "blur" },
        ],
    },
    {
        title: "机构SPV产品ID",
        name: "instSpvProductId",
        rules: [
            { required: true, message: "机构SPV产品ID不能为空", trigger: "blur" },
        ],
    },
    {
        title: "公告标题",
        name: "noticeTitle",
        rules: [{ required: true, message: "公告标题不能为空", trigger: "blur" }],
    },
    {
        title: "公告内容",
        name: "noticeContent",
        rules: [
            {
                required: true,
                message: "公告内容不能为空",
                trigger: "blur",
            },
        ],
    },
    {
        title: "审核意见",
        name: "checkOpinion",
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
        formatter: (i: any) => {
            return formOptions.state[i.state];
        },
    },
    { title: "备注", name: "remark" },
];
const searchNames = [
    "userId",
    "instInvestorId",
    "instSpvProductId",
    "noticeTitle",
    "state",
];
export const formSearchs = forms
    .filter((i) => searchNames.includes(i.name))
    .map((i) => ({ name: i.name, title: i.title, type: i.type || "text" }));
export const formOptions: any = {
    state: { 0: "审核中", 1: "已驳回", 2: "待发布", 3:"已发布" },
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
