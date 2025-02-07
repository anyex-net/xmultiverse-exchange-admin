
import request from "@/utils/request";

/**
 * 查询账户签到明细
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAccountsignindetail= async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/account/accountsignindetail/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询账户签到明细详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getAccountsignindetail = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/account/accountsignindetail/findBy?id=" + id,
        method: "get",
    });
};


/**
 * 删除账户签到明细
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delAccountsignindetail = async (data:any):PromiseRes => {
    return await request({
        url: "/api/account/accountsignindetail/del",
        method: "post",
        data:data
    });
};

