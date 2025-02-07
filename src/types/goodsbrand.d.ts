
interface goodsBrand<T = {}, S = {}> {
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

interface goodsBrandForm {
    id: number | string;
    letter: string;
    logoImageUrl: string;
    name: string;
    status: boolean;
}
interface goodsBrandQueryParams {
    current: number;
    size: number;
    name: string;
    id: number|string;
}
