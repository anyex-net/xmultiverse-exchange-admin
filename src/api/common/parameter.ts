import request from "@/utils/request";

/**
 * 查询参数列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listParameter = async (query: any):PromiseRes<infoData> => {
	return await request({
		url: "/api/common/parameter/data",
		method: "post",
		data: query,
	});
};

/**
 * 查询参数详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getParameter = async (id: number):PromiseRes<paeameterForm> => {
	return await request({
		url: "/api/common/parameter/findBy?id=" + id,
		method: "get",
	});
};

/**
 * 新增修改参数配置
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addParameter = async (param: any):PromiseRes => {
	return await request({
		url: "/api/common/parameter/save",
		method: "post",
		data: param,
	});
};

/**
 * 删除参数配置
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delParameter = async (data:any):PromiseRes => {
	return await request({
		url: "/api/common/parameter/del",
		method: "post",
        data:data
	});
};

