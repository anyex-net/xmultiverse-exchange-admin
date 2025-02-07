import request from "@/utils/request";

/**
 * 查询活动半价购买分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listActivityHotDeals = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/activity/activityHotDeals/data",
        method: "post",
        data: query,
    });
};

/**
 * 根据ID取半价购买
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getActivityHotDeals = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/activity/activityHotDeals/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 查询商品SKU所有数据
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getskuList = async (spuId:any):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSku/skuList?spuId="+spuId,
        method: "get",
    });
};
/**
 * 产品SPU所有数据
 *
 * @param {number} id 参数ID
 * @returns
 */
export const spuList = async ():PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpu/spuList",
        method: "get",
    });
};

/**
 * 新增修改半价购买
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addActivityHotDeals= async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/activity/activityHotDeals/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除半价购买
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delActivityHotDeals= async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/activity/activityHotDeals/del",
        method: "post",
        data:data
    });
};

/**
 *  下架半价活动
 *
 * @param {object} data 菜单Obj
 * @returns
 */
export const pullOffIt = async (id: any):PromiseRes => {
	return await request({
		url: "/api/business/luckybox/activity/activityHotDeals/disable",
		method: "post",
		data: {
			id:id
		},
	});
};
/**
 *  上架半价活动
 *
 * @param {object} data 菜单Obj
 * @returns
 */
export const putOnIt = async (id: any):PromiseRes => {
	return await request({
		url: "/api/business/luckybox/activity/activityHotDeals/enable",
		method: "post",
		data: {
			id:id
		},
	});
};