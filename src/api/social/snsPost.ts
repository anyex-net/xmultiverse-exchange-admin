import request from "@/utils/request";

/**
 * 查询社交帖子
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listSnsPost = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPost/data",
        method: "post",
        data: query,
    });
};
//查看详情
export const getSnsPost = async (id: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPost/findBy?id="+id,
        method: "get",
    });
};
//根据id删除社交帖子
export const delSnsPost = async (data: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsPost/del",
        method: "post",
        data: data,
    });
};
