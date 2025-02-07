
import request from "@/utils/request";

/**
 * 查询账户签到信息
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAccountsignininfo = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/account/accountsignininfo/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询账户签到信息详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getAccountsignininfo = async (id: number):PromiseRes<any>  => {
    return await request({
        url: "/api/account/accountsignininfo/findBy?id=" + id,
        method: "get",
    });
};


/**
 * 删除账户签到信息
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delAccountsignininfo = async (data:any):PromiseRes => {
    return await request({
        url: "/api/account/accountsignininfo/del",
        method: "post",
        data:data
    });
};

