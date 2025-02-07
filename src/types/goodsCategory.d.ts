
interface goodsCategory<T = {}, S = {},X> {
    queryParams: S;
    showSearch: boolean;
    loading: boolean;
    configList: [];
    title: string;
    open: boolean;
    open1:boolean;
    form: T;
    form1:X;
    rules: {};
    rules1:{};
    multiple: boolean;
    single: boolean;
    total: number;
    ids: any;
    brandList:any[];
    treeOptions:any[];
    isExpandAll:boolean;
    refreshTable:boolean;
}

interface goodsCategoryForm {
    id: number | string;
    name: string;
    sort: string |number;
    parentId: string |number;

}
interface goodsCategoryForm1 {
    id: number | string;
    goodsBrandIds:any[] | any;
    name:string;
}
interface goodsCategoryQueryParams {
    current: number;
    size: number;
    name: string;
}
