import request from "@/utils/request";

/**
 * 查询商品品类
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listGoodsSpecGroup = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpecGroup/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询商品品类详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getGoodsSpecGroup= async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpecGroup/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改商品品类
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addGoodsSpecGroup = async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpecGroup/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除商品品类
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delGoodsSpecGroup= async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpecGroup/del",
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
        url: "/api/goods/goodsSpecGroup/del",
        method: "get",

    });
};

