import request from "@/utils/request";

/**
 * 查询社交帖子分享
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listSnsPostShare = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPostShare/data",
        method: "post",
        data: query,
    });
};
//查看详情
export const getSnsPostShare= async (id: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPostShare/findBy?id="+id,
        method: "get",
    });
};
//根据id删除社交帖子分享
export const delSnsPostShare = async (data: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPostShare/del",
        method: "post",
        data: data,
    });
};
