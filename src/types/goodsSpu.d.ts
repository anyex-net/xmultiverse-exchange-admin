
interface goodsSpu<T = {}, S = {}> {
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
    brandList:any[];
    treeOptions:any[];
    specList:any[];

}

interface goodsSpuForm {
    id: number | string;
    brandId: string |number;
    categoryId: string |number;
    spgId: string |number;
    saleable:boolean;
    subTitle:string;
    title:string;
    valid:boolean;

}

interface goodsSpuQueryParams {
    current: number;
    size: number;
    title: string;
    brandId:string|number;
    categoryId:string|number;
    spgId:string|number;
    id:string|number;
}
