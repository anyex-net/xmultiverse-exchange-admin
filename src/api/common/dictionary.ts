import request from "@/utils/request";

/**
 * 查询数据字典列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDictionary= async (query?: any):PromiseRes<[]> => {
	return await request({
		url: "/api/common/dictionary/tree",
		method: "get",
		params: query,
	});
};

/**
 * 根据字典id查看详情
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const getDictionary= async (id?: any):PromiseRes<dictionaryForm> => {
	return await request({
		url: "/api/common/dictionary/findById?id="+id,
		method: "get",
	});
};
/**
 * 新增修改字典
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDictionary = async (param: any):PromiseRes => {
	return await request({
		url: "/api/common/dictionary/save",
		method: "post",
		data: param,
	});
};


/**
 * 删除字典
 *
 * @param {number} id 参数id
 * @returns
 */
export const delDictionary= async (id:number):PromiseRes=> {
	return await request({
		url: "/api/common/dictionary/del",
		method: "post",
		data: {
			id:id
		}
	});
};

