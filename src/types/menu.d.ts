
interface menu <T={},S={},N={}>{
    queryParams: S;
    showSearch: boolean;
    refreshTable: boolean;
    loading: boolean;
    menuList:[];
    isExpandAll: boolean;
    title: string;
    open: boolean;
    form:T;
    rules: {};
    menuOptions: any;
    elTreeProps: N;
    showChooseIcon: boolean;
}

interface menuForm{
    id: number | string;
    parentId: number;
    resCode: string;
    resName: string;
    resShortUrl: string;
    resUrl: string;
    type: boolean;
    icon: string;
    resDest: string;
    sortNum:number;
}
interface menuQueryParams{
    title: string
}
interface menuElTreeProps{
    value: string;
    label: string;
    children: string
}
