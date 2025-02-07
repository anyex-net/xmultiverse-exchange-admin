import request from "@/utils/request";

/**
 * 查询社交帖子点赞
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listSnsPostLike = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPostLike/data",
        method: "post",
        data: query,
    });
};
//查看详情
export const getSnsPostLike = async (id: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPostLike/findBy?id="+id,
        method: "get",
    });
};
//根据id删除社交帖子点赞
export const delSnsPostLike = async (data: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPostLike/del",
        method: "post",
        data: data,
    });
};
