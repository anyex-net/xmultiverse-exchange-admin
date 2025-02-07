import request  from "@/utils/request";
import {praseStrEmpty} from "@/utils/dateTime"
/**
 * 查询用户列表
 *
 * @param {any} query 参数
 * @returns
 */
export const listUser = async (query?:Object):PromiseRes<infoData> => {
	return await request({
		url: "/api/system/user/data",
		method: "post",
		data: query,
	});
};

/**
 *  启用或停用用户状态
 *
 * @param {object} data 菜单Obj
 * @returns
 */
export const changeUserStatus = async (id: any):PromiseRes => {
	return await request({
		url: "/api/system/user/changeStatus",
		method: "post",
		data: {
			id:id
		},
	});
};

/**
 *  查询用户详细
 *
 * @param {string} userId 用户id
 * @returns 用户信息
 */
export const getUser = async (userId: string):PromiseRes<userForm>=> {
	return await request({
		url: "/api/system/user/findBy?id=" + praseStrEmpty(userId),
		method: "get",
	});
};
/**
 *  添加修改用户
 *
 * @param {object} data 菜单Obj
 * @returns
 */
export const addUser = async (data: any):PromiseRes => {
	return await request({
		url: "/api/system/user/save",
		method: "post",
		data: data,
	});
};

/**
 * 删除用户
 *
 * @param {string} menuId 菜单ID
 * @returns
 */
export const delUser = async (data: any):PromiseRes => {
	return await request({
		url: "/api/system/user/del" ,
		method: "post",
        data:data
	});
};
/**
 * 用户密码重置
 *
 * @param {string} id   用户ID
 * @param {string} newpassword 密码
 * @returns
 */
export const resetUserPwd = async (id: any, newPwd: any):PromiseRes => {
	return await request({
		url: "/api/system/user/resetNewPwd",
		method: "post",
		data: {
			id,
			newPwd,
		},
	});
};

/**
 * 查询用户个人信息
 *
 * @returns
 */
export const getUserProfile = async ():PromiseRes<permissionForm> => {
	return await request({
		url: "/admin/auth/user/current/get",
		method: "get",
	});
};

/**
 * 修改用户个人信息
 *
 * @param {object} data Obj
 * @returns
 */
export const updateUserProfile = async (data: any):PromiseRes => {
	return await request({
		url: "/api/auth/user/update",
		method: "post",
		data: data,
	});
};
/**
 * 用户密码重置
 *
 * @param {string} oldPassword 旧密码
 * @param {string} newPassword 新密码
 * @returns
 */
export const updateUserPwd = async (oldPwd: any, newPwd: any) => {
	return await request({
		url: "/api/system/user/changePwd",
		method: "post",
		data:{
			oldPwd,
			newPwd,
		}
	});
};

/**
 * 用户头像上传
 *
 * @param {Object} data
 * @returns
 */
export const uploadAvatar = async (data: any):PromiseRes => {
	return await request({
		url: "/action/file/upload/post",
		method: "post",
		data: data,
		headers:{
			"Content-Type":'multipart/form-data'
		}
	});
};
