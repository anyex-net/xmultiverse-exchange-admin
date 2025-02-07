import request from "@/utils/request";

/**
 * 查询交易日列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listtradeDay = async (query: any) => {
	return await request({
		url: "/api/common/sysTradeDay/data",
		method: "post",
		data: query,
	});
};

/**
 * 查询交易日详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const gettradeDay = async (id: number) => {
	return await request({
		url: "/api/common/sysTradeDay/findBy?id=" + id,
		method: "get",
	});
};

/**
 * 新增修改交易日配置
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addtradeDay = async (param: any) => {
	return await request({
		url: "/api/common/sysTradeDay/save",
		method: "post",
		data: param,
	});
};

/**
 * 删除交易日配置
 *
 * @param {string} data 参数ID
 * @returns
 */
export const deltradeDay = async (data:any) => {
	return await request({
		url: "/api/common/sysTradeDay/del",
		method: "post",
        data:data
	});
};

