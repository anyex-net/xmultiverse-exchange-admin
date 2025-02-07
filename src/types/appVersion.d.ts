
interface appVersion<T = {}, S = {}> {
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
    deviceList:any[];
}

interface appVersionForm {
    id: number | string;
    appVersion: string;
    buildVersion: string;
    canSupport: boolean;
    checkStatus: boolean;
    deviceType: string;
    remark: string;
}
interface appVersionQueryParams {
    current: number;
    size: number;
    deviceType: string;
    // remark: string;
}
