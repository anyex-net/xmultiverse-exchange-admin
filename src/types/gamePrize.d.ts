interface gamePrize<T = {}, S = {}> {
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
    gameType: any[];

}

interface gamePrizeFom {
    id: number | string;
    cost: string | number;
    gameId: string | number;
    percentWinningAmount: string | number;
    price: string | number;
    prizeImgUrl: string;
    prizeName: string;
    rewardBalance: string | number;
    status: boolean;
    remark: string;
}

interface gamePrizeQueryParams {
    current: number;
    size: number;
    prizeName: string;
    gameId: string | number;
}
