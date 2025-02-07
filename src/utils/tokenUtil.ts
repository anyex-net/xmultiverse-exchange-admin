import {hex_md5} from'./md5'

//150位的后面加上principal和AuthUser的principal对应
export const getToken150AndStime = (principal:string|undefined) => {
	let stime=new Date().getTime();//1574048340193 13位
	let position = Math.floor(Math.random() * 10); //0到9随机数 定位
	let value = parseInt(stime.toString().substring(position, position + 1)); //对应下标的值
	let token = encodeCredentials(position) + encodeCredentials(value) + confusion(position, value, principal);
	return {token:token,stime:stime};
}
//获取盐值

export const getSaltNoArg = () => {
   
	let SALT_CODE:string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];//16位
	let sb = "";
    
	let length:number = parseInt((Math.random() * 17).toString(), 10);//0到17
	for (let i = 0; i < length; ++i) {
		let k:number = parseInt((Math.random() * (SALT_CODE.length)).toString(), 10);
		sb += SALT_CODE[k];
	}
	return sb;
}
//获取盐值带参数
export const getSalt = (length:number) => {
	let SALT_CODE = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
	let sb = "";
	for (let i = 0; i < length; ++i) {
		let k = parseInt((Math.random() * (SALT_CODE.length)).toString(), 10);
		sb += SALT_CODE[k];
	}
	return sb;
}
//加密 credentials要加密的数据
export const encodeCredentials = (credentials:number|string) => {
	let salt = getSaltNoArg();
	let suffixSalt = getSalt(18 - salt.length);
	credentials = salt + credentials + suffixSalt;
	return salt + hex_md5(credentials) + suffixSalt;
}
//token为150位时获取最后50位加密
export const confusion = (position:number, value:number, ecode:string|undefined) => {
	if (ecode == null) {
		return "";
	} else if (ecode.length <= position + value) {
		return ecode;
	} else {
		let result = ecode.substring(ecode.length - value);
		result = result + ecode.substring(position + 1, ecode.length - value);
		result = result + ecode.substring(0, position + 1);
		return result;
	}
}
