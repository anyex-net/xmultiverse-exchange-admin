import request from "@/utils/request";

/**
 * 查询社交帖子评论
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listSnsPostComment = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPostComment/data",
        method: "post",
        data: query,
    });
};
//查看详情
export const getSnsPostComment= async (id: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPostComment/findBy?id="+id,
        method: "get",
    });
};
//根据id删除社交帖子评论
export const delSnsPostComment = async (data: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPostComment/del",
        method: "post",
        data: data,
    });
};
