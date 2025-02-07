
import request from "@/utils/request";

/**
 * 查询账户邀请奖励
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAccountinviterewardsdetail = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/account/accountinviterewardsdetail/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询账户邀请奖励详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getAccountinviterewardsdetail = async (id: number) => {
    return await request({
        url: "/api/account/accountinviterewardsdetail/findBy?id=" + id,
        method: "get",
    });
};


/**
 * 删除账户邀请奖励
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delAccountinviterewardsdetail = async (data:any) => {
    return await request({
        url: "/api/account/accountinviterewardsdetail/del",
        method: "post",
        data:data
    });
};

