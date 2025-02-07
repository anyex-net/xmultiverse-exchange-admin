import request from "@/utils/request";

/**
 * 查询角色列表
 *
 * @param {object} query
 * @returns
 */
export const listRole = (query: any):PromiseRes<infoData> => {
	return request({
		url: "/api/system/role/data",
		method: "post",
		data: query,
	});
};
/**
 * 导出
 *
 * @param {object} query
 * @returns
 */
export const exportExcel = ():PromiseRes<infoData> => {
	return request({
		url: "/api/system/role/exportExcel",
		method: "get",
		responseType: 'blob',
	});
};
/**
 * 查询角色详细
 *
 * @param {string} roleId 角色ID
 * @returns
 */
export const getRole = (roleId: string):PromiseRes<roleForm> => {
	return request({
		url: "/api/system/role/findBy?id=" + roleId,
		method: "get",
	});
};
/**
 * 获得所有角色
 *
 * @param
 * @returns
 */
export const roleAll = ():PromiseRes<[]>=> {
	return request({
		url: "/api/system/role/findAll" ,
		method: "get",
	});
};
/**
 * 获得权限树
 *
 * @param
 * @returns
 */
export const getJurisdictionList = ():PromiseRes<''>=> {
	return request({
		url: "/api/system/resource/tree" ,
		method: "get",
	});
};

/**
 * 新增修改角色
 *
 * @param {object} data
 * @returns
 */
export const addRole = (data: any):PromiseRes => {
	return request({
		url: "/api/system/role/save",
		method: "post",
		data: data,
	});
};

/**
 * 创建角色
 *
 * @param {object} data
 * @returns
 */
export const addRolepermission = (data: any):PromiseRes=> {
	return request({
		url: "/api/system/role/saveGrant",
		method: "post",
		data: data,
	});
};
/**
 *  根据角色id查询分配的权限
 *
 * @param {string} roleId 角色id
 * @returns
 */
export const unallocatedUserList = async (roleId: string):PromiseRes<[]> => {
	return await request({
		url: "/api/system/role/findByRoleId?roleId=" + roleId,
		method: "get",
	});
};

/**
 * 删除角色
 *
 * @param {obj} data
 * @returns
 */
export const delRole = async (data: string) => {
	return await request({
		url: "/api/system/role/del" ,
		method: "post",
		data
	});
};





