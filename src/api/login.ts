import request from "@/utils/request";

// 获取clientid
export const getClientId=async():PromiseRes<ClientId>=>{
    return await request({
        url:"/public/client/id/get",
        method:"get",

    });
};
// 登录方法
export const login=async(loginParam:{})=>{
    return await request({
        url:"/api/auth/login/submit",
        method:"post",
        data:loginParam
    });
};
/**
 * 获取用户详细信息
 *
 * @returns
 */
export const getInfo=async():PromiseRes<infoType<infoTypeRes>> =>{
    return await request({
        url:"/api/auth/userInfo",
        method:"get",
    });
};
/**
 * 获取验证码
 *
 * @returns
 */
export const getCodeImg = async (data:{}):PromiseRes<infoType> => {
	return await request({
		url: "/api/common/createKaptcha",
		method: "post",
        data:data
	});
};
// 退出登录
export const logout=async()=>{
    return await request({
        url:"/api/auth/logout",
        method:"post",
    });
};
