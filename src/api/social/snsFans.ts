import request from "@/utils/request";

/**
 * 查询社交关注(我关注的)
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listSnsFans = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsFans/data",
        method: "post",
        data: query,
    });
};
//查看详情
export const getSnsFans= async (id: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsFans/findBy?id="+id,
        method: "get",
    });
};
//根据指定ID删除
export const delSnsFans= async (data: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsFans/del",
        method: "post",
        data: data,
    });
};
