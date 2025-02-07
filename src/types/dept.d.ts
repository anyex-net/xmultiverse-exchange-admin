
interface dept<T = {}, S = {}> {
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

interface deptForm {
    id: number | string;
    orgCode:number|string;
    orgName: string;
    parentId: number|string;
    orgDest:string;
    sortNum:number;
}
interface deptQueryParams {
    orgName:string;
}
