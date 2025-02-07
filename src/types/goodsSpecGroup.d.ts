
interface goodsSpecGroup<T = {}, S = {}> {
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

}

interface goodsSpecGroupForm {
    id: number | string;
    remark: string;
    name: string;
}
interface goodsSpecGroupQueryParams {
    current: number;
    size: number;
    name: string;
}
