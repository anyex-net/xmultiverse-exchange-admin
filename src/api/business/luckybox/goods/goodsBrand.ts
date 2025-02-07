import request from "@/utils/request";

/**
 * 查询商品品牌分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listGoodsBrand = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsBrand/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询商品品牌详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getGoodsBrand= async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsBrand/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改商品品牌
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addGoodsBrand = async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsBrand/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除商品品牌
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delGoodsBrand = async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsBrand/del",
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

