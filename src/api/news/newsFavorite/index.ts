import request from "@/utils/request";

/**
 * 查询资讯收藏分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listnewsFavorite = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/news/newsFavorite/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询资讯收藏详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getnewsFavorite = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/news/newsFavorite/findBy?id=" + id,
        method: "get",
    });
};
/**
 * 新增修改资讯收藏
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addnewsFavorite = async (param: any):PromiseRes => {
    return await request({
        url: "/api/news/newsFavorite/save",
        method: "post",
        data: param,
    });
};
/**
 * 删除资讯收藏
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delnewsFavorite = async (data:any):PromiseRes => {
    return await request({
        url: "/api/news/newsFavorite/del",
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

