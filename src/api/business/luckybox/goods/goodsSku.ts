import request from "@/utils/request";

/**
 * 查询商品SKU分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listGoodsSku = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSku/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询商品SKU详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getGoodsSku= async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSku/findBy?id=" + id,
        method: "get",
    });
};
/**
 * 查询产品SPU所有数据
 *
 * @param {number} id 参数ID
 * @returns
 */
export const spuLists= async ():PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpu/spuList",
        method: "get",
    });
};
/**
 * 查询商品品类对应品类参数所有数据
 *
 * @param {number} id 参数ID
 * @returns
 */
export const specParamList= async (spgId:any):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpecParam/specParamList?spgId="+spgId,
        method: "get",
    });
};

/**
 * 新增修改商品SKU
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addGoodsSku = async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSku/save",
        method: "post",
        data: param,
    });
};
/**
 *  下架商品sku
 *
 * @param {object} data 菜单Obj
 * @returns
 */
export const pullOffGoods = async (id: any):PromiseRes => {
	return await request({
		url: "/api/business/luckybox/goods/goodsSku/pullOffSale",
		method: "post",
		data: {
			id:id
		},
	});
};
/**
 *  上架商品sku
 *
 * @param {object} data 菜单Obj
 * @returns
 */
export const putOnGoods = async (id: any):PromiseRes => {
	return await request({
		url: "/api/business/luckybox/goods/goodsSku/putOnSale",
		method: "post",
		data: {
			id:id
		},
	});
};
/**
 * 删除商品SKU
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delGoodsSku = async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSku/del",
        method: "post",
        data:data
    });
};
/**
 * 上传
 *
 * @param {string} data
 * @returns
 */
export const uploadPolicy = async ():PromiseRes => {
    return await request({
        url: "/api/common/upload/policy",
        method: "get",

    });
};

