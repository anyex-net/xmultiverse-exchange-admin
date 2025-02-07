
interface game<T = {}, S = {}> {
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
    uploadParams:any;
    uploadUrl:string,

}

interface gameForm {
    id: number | string;
    gameChips: string|number;
    gameImgUrl: string;
    name: string;
    status: boolean;
    remark:string;
}
interface gameQueryParams {
    current: number;
    size: number;
    name: string;
    id: number | string;
}
