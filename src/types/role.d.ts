
interface role<T={},S={}>{
    queryParams: S;
    showSearch: boolean;
    loading: boolean;
    roleList:[];
    title: string;
    open: boolean;
    form:T;
    rules: {};
    multiple:boolean;
    single:boolean;
    total:number;
    ids:any;
    setJurisdictionShow:boolean;
    setJurisdictionTableData:any[];
    setJurisdictionForm:{
        id:any,
        resourceIds:object[]
    }
}

interface roleForm{
    id: number | string;
    roleCode: string;
    roleName:string;
    needGa:boolean;
    roleDest:string|number;
}
interface roleQueryParams{
    roleName: string;
    current: number;
    size: number;
}
