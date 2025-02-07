import request from "@/utils/request";

/**
 * 查询资讯点赞分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listnewsLike = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/news/newsLike/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询资讯点赞详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getnewsLike = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/news/newsLike/findBy?id=" + id,
        method: "get",
    });
};
/**
 * 新增修改资讯点赞
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addnewsLike = async (param: any):PromiseRes => {
    return await request({
        url: "/api/news/newsLike/save",
        method: "post",
        data: param,
    });
};
/**
 * 删除资讯点赞
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delnewsLike = async (data:any):PromiseRes => {
    return await request({
        url: "/api/news/newsLike/del",
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

