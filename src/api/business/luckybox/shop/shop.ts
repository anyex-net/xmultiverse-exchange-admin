import request from "@/utils/request";

/**
 * 查询店铺列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listShopArr = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/shop/shop/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询店铺详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getshopArr = async (id: number):PromiseRes<parameterForm> => {
    return await request({
        url: "/api/business/luckybox/shop/shop/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改店铺
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addshopArr = async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/shop/shop/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除店铺
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delShopArr = async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/shop/shop/del",
        method: "post",
        data:data
    });
};

