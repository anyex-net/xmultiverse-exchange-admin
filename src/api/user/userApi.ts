import request from "@/utils/request";

/**
 * 查询用户认证个人KYC
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
    return await request({
        url: "/api/user/userApi/data",
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
        url: "/api/user/userApi/findBy?id=" + id,
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
        url: "/api/user/userApi/save",
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
        url: "/api/user/userApi/del",
        method: "post",
        data: data,
    });
};

export const checkDatas = async (data: any) => {
    return await request({
        url: "/api/user/userApi/check",
        method: "post",
        data: data,
    });
};

