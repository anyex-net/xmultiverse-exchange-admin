interface activityTreasureHunt<T = {}, S = {}> {
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
    skuList: any[];
    spuLists: any[];
}

interface activityTreasureHuntForm {
    id: number | string;
    actCurrentAccountNum:string | number;
    actCurrentPurchasedNum: string | number;
    actCurrentRound: string | number;
    activityName: string;
    skuId: string | number;
    spuId: string | number;
    treasureEndTime: any;
    treasurePrice: string | number;
    treasureRobotNum: string | number;
    treasureStartTime: any;
    treasureSumNum: string | number;
    treasureSumRound: string | number;
    remark: string;
    status: boolean;

}

interface activityTreasureHuntParams {
    current: number;
    size: number;
    activityName: string;
    spuId: string | number;
    skuId: string | number;
}
