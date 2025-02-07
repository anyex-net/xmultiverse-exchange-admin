import request  from "@/utils/request";
/**
 * 查询资源列表
 *
 * @param {any} query 参数
 * @returns
 */
export const listResource = async (query?:Object):PromiseRes<[]> => {
	return await request({
		url: "/api/system/resource/tree",
		method: "get",
		params: query,
	});
};
/**
 *根据id获取资源详情
 *
 * @param {object} param 菜单Obj
 * @returns
 */
export const getResource= async (id: string):PromiseRes<menuForm> => {
	return await request({
		url: "/api/system/resource/findBy?id="+id,
		method: "get",
	});
};

/**
 * 新增修改资源
 *
 * @param {object} param 资源Obj
 * @returns
 */
export const addResource = async (param: any):PromiseRes => {
	return await request({
		url: "/api/system/resource/save",
		method: "post",
		data: param,
	});
};

/**
 * 删除资源
 *
 * @param {string} menuId 菜单ID
 * @returns
 */
export const delResource = async (id: string):PromiseRes => {
	return await request({
		url: "/api/system/resource/del",
		method: "post",
		data:{
			id:id
		}
	});
};

/**
 * 获取路由
 *
 * @returns
 */
export const getRouters = async () => {
	return await request({
		url: "/api/auth/menuTree",
		method: "get",
	});
};
