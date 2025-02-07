
interface notice<T = {}, S = {}> {
    queryParams: S;
    showSearch: boolean;
    loading: boolean;
    configList: [];
    title: string;
    open: boolean;
    open1: boolean;
    form: T;
    rules: {};
    multiple: boolean;
    single: boolean;
    total: number;
    ids: any;
    langTypes:any[];
    uploadParams:any;
    uploadUrl:string,

}

interface noticeForm {
    id: number | string;
    content: string;
    imageUrl: string;
    langType: string;
    status: boolean;
    title: string;
    remark: string;
}
interface noticeQueryParams {
    current: number;
    size: number;
    title: string;
}
