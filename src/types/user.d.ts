
interface user<T={},S={},N={},X={}>{
    queryParams: S;
    showSearch: boolean;
    loading: boolean;
    userList:[];
    title: string;
    open: boolean;
    form:T;
    rules: {};
    elTreeProps: N;
    multiple:boolean;
    single:boolean;
    total:number;
    ids:any;
    dateRange:any;
    sysUserSex:X[];
    userTypes:X[];
    userParent:X[];
    deptOptions:[];
    postOptions:X[];

}

interface userForm{
    id: number | string;
    userName: string
    passWord: string;
    phone: string;
    roleIds: any[];
    orgId:string;
    gender:boolean;
    active:boolean;
}
interface userQueryParams{
    userName: string;
    current: number;
    size: number;
    phone:string;
    // startDate:string;
    // endDate:string;
}
interface userElTreeProps{
    value: string;
    label: string;
    children: string
}
interface userType{
    id:number|boolean;
    name:string;
}
interface IUser {
    userId: string;
	userName: string;
	createTime: string;
	phonenumber: string;
	admin?: boolean;
	avatar?: string;
	createBy?: string;
	delFlag?: string;
	dept: IDept;
	deptId?: string;
	email: string;
	loginDate?: string;
	loginIp?: string;
	nickName: string;
	postIds?: string;
	postNameArray?: string;
	remark?: string;
	roleIds?: undefined;
	roleNameArray?: undefined;
	roles?: [];
	salt?: undefined;
	searchValue?: undefined;
	sex?: string;
	status?: string;
	updateBy?: undefined;
	updateTime?: undefined;

}
