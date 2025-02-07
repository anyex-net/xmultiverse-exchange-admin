
import request from "@/utils/request";

/**
 * 查询账户邀请统计
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAccountInviteStatistics = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/account/accountinvitestatistics/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询账户邀请统计详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getAccountInviteStatistics = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/account/accountinvitestatistics/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改账户邀请统计
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const saveAccountInviteStatistics = async (param: any):PromiseRes => {
    return await request({
        url: "/api/account/accountinvitestatistics/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除账户邀请统计
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delAccountInviteStatistics = async (data:any):PromiseRes => {
    return await request({
        url: "/api/account/accountinvitestatistics/del",
        method: "post",
        data:data
    });
};

/**
 * 所有下拉账户邀请统计
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allAccountInviteStatistics = async (query: any) => {
    return await request({
        url: "/api/account/accountinvitestatistics/all",
        method: "post",
        data: query,
    });
};

