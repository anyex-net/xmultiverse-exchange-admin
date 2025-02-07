
interface parameter<T = {}, S = {}> {
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

interface parameterForm {
    id: number | string;
    division: string;
    parameterName: string;
    remark: string;
    systemName: string;
    type: string;
    value: string;
    valueBound: string;
}
interface parameterQueryParams {
    current: number;
    size: number;
    division: string;
    remark: string;
}
