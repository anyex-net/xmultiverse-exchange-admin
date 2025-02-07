import request from "@/utils/request";

/**
 * 查询APP版本列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAppVersion = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/common/appVersion/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询PP版本详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getAppVersion = async (id: number):PromiseRes<[]> => {
    return await request({
        url: "/api/common/appVersion/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改APP版本
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addAppVersion = async (param: any):PromiseRes => {
    return await request({
        url: "/api/common/appVersion/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除APP版本
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delAppVersion = async (data:any):PromiseRes => {
    return await request({
        url: "/api/common/appVersion/del",
        method: "post",
        data:data
    });
};

