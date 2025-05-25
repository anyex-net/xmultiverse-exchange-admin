import request from "@/utils/request";

/**
 * 查询用户认证个人KYC
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
    return await request({
        url: "/api/user/userInviteRewardConfig/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询用户认证个人KYC详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
    return await request({
        url: "/api/user/userInviteRewardConfig/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改用户认证个人KYC
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
    return await request({
        url: "/api/user/userInviteRewardConfig/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除用户认证个人KYC
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
    return await request({
        url: "/api/user/userInviteRewardConfig/del",
        method: "post",
        data: data,
    });
};

export const checkDatas = async (data: any) => {
    return await request({
        url: "/api/user/userInviteRewardConfig/check",
        method: "post",
        data: data,
    });
};
