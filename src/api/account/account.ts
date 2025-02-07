import request from "@/utils/request";

/**
 * 查询账户列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAccountArr = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/account/account/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询账户详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getAccountArr = async (id: number):PromiseRes<parameterForm> => {
    return await request({
        url: "/api/account/account/findBy?id=" + id,
        method: "get",
    });
};
