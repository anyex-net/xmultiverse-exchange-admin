import request from "@/utils/request";

/**
 * 查询社交关注(我关注的)
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listSnsFollow = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsFollow/data",
        method: "post",
        data: query,
    });
};
//查看详情
export const getSnsFollow= async (id: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsFollow/findBy?id="+id,
        method: "get",
    });
};
//根据id删除社交关注(我关注的)
export const delSnsFollow = async (data: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsFollow/del",
        method: "post",
        data: data,
    });
};
