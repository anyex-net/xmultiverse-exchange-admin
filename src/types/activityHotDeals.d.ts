
interface activityHotDeals<T = {}, S = {}> {
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
    skuList:any[];
    spuLists:any[];
}

interface activityHotDealsForm {
    id: number | string;
    actCurrentAccountNum: string |number;
    actCurrentPurchasedNum: string |number;
    actCurrentRound: string |number;
    activityName: string;
    skuId:string|number;
    spuId:string|number;
    activityEndTime:any;
    activityPrice:string |number;
    activityRobotNum:string|number;
    activityStartTime:any;
    activitySumNum:string|number;
    activitySumRound:string|number;
    balancePayment:string|number;
    remark:string;
    status:boolean;
    activitySumStock:string|number;

}

interface activityHotDealsParams {
    current: number;
    size: number;
    activityName: string;
    spuId:string|number;
    skuId:string|number;
}
