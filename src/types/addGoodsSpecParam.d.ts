
interface goodsSpecParam<T = {}, S = {}> {
    queryParams: S;
    queryParams1:S;
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
    specList:any[];
    goodsspecList:any[];
    total1:number;

}

interface goodsSpecParamGroupForm {
    id: number | string;
    isNumeric: boolean;
    paramName: string;
    spgId: string;
    paramValue: string;
    unit: string;
}
interface goodsSpecParamQueryParams {
    current: number;
    size: number;
    paramName?: string;
    name?:string;
    spgId?:string;
}
