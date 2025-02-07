
import request from "@/utils/request";

/**
 * 查询账户收藏
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAccountfavorite= async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/openim/account/accountfavorite/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询账户收藏
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getAccountfavorite = async (id: number) => {
    return await request({
        url: "/api/openim/account/accountfavorite/findBy?id=" + id,
        method: "get",
    });
};


/**
 * 删除账户收藏
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delAccountfavorite = async (data:any) => {
    return await request({
        url: "/api/openim/account/accountfavorite/del",
        method: "post",
        data:data
    });
};

