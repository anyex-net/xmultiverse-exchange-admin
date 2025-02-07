
interface operatelog<S = {}> {
    queryParams: S;
    showSearch: boolean;
    loading: boolean;
    operateList: [];
    multiple: boolean;
    single: boolean;
    total: number;
    ids: any;
    dateRange:any;
    typeList?:any[];
}

interface operatelogQueryParams {
    redisKey?:string;
}
interface msgRecordQueryParams {
    current: number;
    size: number;
    object:string;
}
interface accessLogQueryParams {
    current: number;
    size: number;
    userName:string;
    type:string;
}
interface regionQueryParams {
    current: number;
    size: number;
    deviceName:string;
}
interface appDeviceQueryParams {
    current: number;
    size: number;
    deviceName:string;
}
