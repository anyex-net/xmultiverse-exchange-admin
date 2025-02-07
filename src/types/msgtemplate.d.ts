
interface msgTemplate<T = {}, S = {}> {
    queryParams: S;
    showSearch: boolean;
    loading: boolean;
    configList: [];
    title: string;
    open: boolean;
    form: T;
    rules: {};
    multiple: boolean;
    single: boolean;
    total: number;
    ids: any;
    langType:any[];
    typeList:any[];
}

interface msgTemplateForm {
    id: number | string;
    content: string;
    lang: string;
    title: string;
    tplKey: string;
    type: string;
    dest: string;
}
interface msgTemplateQueryParams {
    current: number;
    size: number;
    tplKey: string;
    title: string;
}
