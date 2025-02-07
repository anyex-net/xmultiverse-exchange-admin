import request from "@/utils/request";

/**
 * 查询产品SPU分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listGoodsSpu = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpu/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询产品SPU详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getGoodsSpu = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpu/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 查询商品品牌所有数据
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getbrandList = async ():PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsBrand/brandList",
        method: "get",
    });
};
/**
 * 返回以TREEMODEL对象的所有数据
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getGoodsCategoryTree = async ():PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsCategory/tree",
        method: "get",
    });
};

/**
 * 新增修改产品SPU
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addGoodsSpu= async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpu/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除产品SPU
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delGoodsSpu = async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsSpu/del",
        method: "post",
        data:data
    });
};

