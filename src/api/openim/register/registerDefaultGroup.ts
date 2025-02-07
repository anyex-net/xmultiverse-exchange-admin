import request from "@/utils/request";

/**
 * 查询注册默认群
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listRegisterDefaultGroup= async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/openim/registerDefaultGroup/data",
        method: "post",
        data: query,
    });
};

/**
 * 保存注册默认群
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addRegisterDefaultGroup= async (param: any):PromiseRes => {
    return await request({
        url: "/api/openim/registerDefaultGroup/save",
        method: "post",
        data: param,
    });
};

/**
 * 根据指定ID删除
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delRegisterDefaultGroup= async (data:any):PromiseRes => {
    return await request({
        url: "/api/openim/registerDefaultGroup/del",
        method: "post",
        data:data
    });
};

