type PromiseRes<T={}>=Promise<ManageResult<T>>
interface ManageResult<T={}>{
    code?:number;
    data:T;
}

interface ClientId{
    id:string
}
interface infoType<T={}>{
    permissions:string;
    roles:string;
    user:T;
}
interface infoTypeRes{
    avatarUrl?:string;
    realName:string;

}
interface infoData{
    records:[];
    total:number;
}
interface statisticsObj{
    activityNum:number;
    depositTotal:number;
    lotteryNum:number;
    ordersNum:number;
    partakeNum:number;
}
