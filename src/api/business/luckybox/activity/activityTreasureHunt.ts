import request from "@/utils/request";

/**
 * 查询活动一元夺宝分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listActivityTreasureHunt = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/activity/activityTreasureHunt/data",
        method: "post",
        data: query,
    });
};

/**
 * 根据ID取活动一元夺宝
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getActivityTreasureHunt = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/activity/activityTreasureHunt/findBy?id=" + id,
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
 * 新增修改活动一元夺宝
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addActivityTreasureHunt= async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/activity/activityTreasureHunt/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除活动一元夺宝
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delActivityTreasureHunt = async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/activity/activityTreasureHunt/del",
        method: "post",
        data:data
    });
};

/**
 *  下架夺宝活动
 *
 * @param {object} data 菜单Obj
 * @returns
 */
export const pullOffIt = async (id: any):PromiseRes => {
	return await request({
		url: "/api/business/luckybox/activity/activityTreasureHunt/disable",
		method: "post",
		data: {
			id:id
		},
	});
};
/**
 *  上架夺宝活动
 *
 * @param {object} data 菜单Obj
 * @returns
 */
export const putOnIt = async (id: any):PromiseRes => {
	return await request({
		url: "/api/business/luckybox/activity/activityTreasureHunt/enable",
		method: "post",
		data: {
			id:id
		},
	});
};
