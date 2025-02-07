interface goodsSku<T = {}, S = {}> {
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
    uploadParams: any;
    uploadUrl: string;
    spuList: any[];
    specList: any[];
    fileList: any[];
    open1: boolean;
    open2: boolean;
    param: any[];
    rules1: any;
    mainImages: any[];
    detailImages?: [];

    fileList1: any[];

    spgId: number | string;
}

interface goodsSkuForm {
    id: number | string;
    iconImage: string;
    detailImages: any;
    mainImages: any;
    param: any;
    price: number | string;
    saleable: boolean;
    spuId: number | string;
    title: string;
    valid: boolean;
    description: string;
    sellingPoint: string;
    subTitle: string;
    stock: string | number;
    spgId: number | string
}

interface goodsSkuQueryParams {
    current: number;
    size: number;
    title: string;
    spuId: string | number;
    id: string | number;
}
