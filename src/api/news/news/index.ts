import request from "@/utils/request";

/**
 * 查询资讯管理分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listnewsNews = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/news/news/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询资讯管理详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getnewsNews = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/news/news/findBy?id=" + id,
        method: "get",
    });
};
/**
 * 新增修改资讯管理
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addnewsNews = async (param: any):PromiseRes => {
    return await request({
        url: "/api/news/news/save",
        method: "post",
        data: param,
    });
};
/**
 * 更新状态
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const newsUpdateStatuson = async (data: any):PromiseRes => {
    return await request({
        url: "/api/news/news/publish",
        method: "post",
        data: data,
    });
};
/**
 * 更新状态
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const newsUpdateStatusoff = async (data: any):PromiseRes => {
    return await request({
        url: "/api/news/news/unpublish",
        method: "post",
        data: data,
    });
};
/**
 * 删除资讯管理
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delnewsNews = async (data:any):PromiseRes => {
    return await request({
        url: "/api/news/news/del",
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

