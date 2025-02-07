
interface dictionary<T = {}, S = {}> {
    queryParams: S;
    showSearch: boolean;
    loading: boolean;
    deptList: [];
    title: string;
    open: boolean;
    form: T;
    rules: {};
    multiple: boolean;
    single: boolean;
    total: number;
    ids: any;
    refreshTable:boolean;
    isExpandAll:boolean;
    AreaOptions:any;
}

interface dictionaryForm {
    id: number | string;
    parentId:number|string;
    active: boolean;
    code: string;
    lang:string;
    name:string;
    sortNum:number|string;
    dest:string;
}
interface dictionaryQueryParams {
    name:string;
}
