import request from "@/utils/request";

/**
 * 查询商品分类分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listGoodsCategory = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsCategory/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询商品分类详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getGoodsCategory = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsCategory/findBy?id=" + id,
        method: "get",
    });
};
/**
 * 获取商品分类与品牌关联信息
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getFindByGoodsCategoryId = async (categoryId: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsCategory/findByGoodsCategoryId?categoryId=" + categoryId,
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
export const getGoodsCategoryTree = async (query?:any):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/goods/goodsCategory/tree",
        method: "get",
        params:query
    });
};

/**
 * 新增修改商品分类
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addGoodsCategory= async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsCategory/save",
        method: "post",
        data: param,
    });
};
/**
 * 保存商品分类与品牌关联信息(brandIds逗号分隔)
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const saveGoodsBrand= async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsCategory/saveGoodsBrand",
        method: "post",
        data: param,
    });
};

/**
 * 删除商品分类
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delGoodsCategory = async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/goods/goodsCategory/del",
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

