import request from "@/utils/request";

/**
 * 查询评论点赞分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listlikeArr = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPostCommentLike/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询评论点赞详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getlikeArr = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/social/snsPostCommentLike/findBy?id=" + id,
        method: "get",
    });
};
/**
 * 新增修改评论点赞
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addlikeArr = async (param: any):PromiseRes => {
    return await request({
        url: "/api/social/snsPostCommentLike/save",
        method: "post",
        data: param,
    });
};
/**
 * 删除评论点赞
 *
 * @param {string} data 参数ID
 * @returns
 */
export const dellikeArr = async (data:any):PromiseRes => {
    return await request({
        url: "/api/social/snsPostCommentLike/del",
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

