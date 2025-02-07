import request from "@/utils/request";

/**
 * 查询机构列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDept= async (query?: any):PromiseRes<[]> => {
	return await request({
		url: "/api/system/organization/tree",
		method: "get",
		params: query,
	});
};

/**
 * 查询机构列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const organizationFindBy= async (data?: any):PromiseRes<[]> => {
	return await request({
		url: "/api/system/organization/data",
		method: "post",
        data:data
	});
};

/**
 * 根据机构id查看详情
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const getOrganization= async (id?: any):PromiseRes<deptForm> => {
	return await request({
		url: "/api/system/organization/findBy?id="+id,
		method: "get",
	});
};
/**
 * 新增机构
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDept = async (param: any):PromiseRes => {
	return await request({
		url: "/api/system/organization/save",
		method: "post",
		data: param,
	});
};


/**
 * 删除机构
 *
 * @param {number} id 参数id
 * @returns
 */
export const delDept= async (id:number):PromiseRes=> {
	return await request({
		url: "/api/system/organization/del",
		method: "post",
		data: {
			id:id
		}
	});
};

