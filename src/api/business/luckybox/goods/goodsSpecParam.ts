import request from "@/utils/request";

/**
 * 查询商品品类参数
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listGoodsSpecParam = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpecParam/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询商品品类参数详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getGoodsSpecParam= async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpecParam/findBy?id=" + id,
        method: "get",
    });
};
/**
 * 查询商品品类所有数据
 *
 * @param {number} id 参数ID
 * @returns
 */
export const specGroupList= async ():PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpecGroup/specGroupList",
        method: "get",
    });
};

/**
 * 新增修改商品品类参数
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addGoodsSpecParam = async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpecParam/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除商品品类参数
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delGoodsSpecParam= async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpecParam/del",
        method: "post",
        data:data
    });
};

