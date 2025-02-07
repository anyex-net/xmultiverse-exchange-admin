import request from "@/utils/request";

/**
 * 查询通知账号分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listNotifyAccount = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/openim/notificationAccount/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询通知账号详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getNotifyAccount = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/openim/notificationAccount/findBy?id=" + id,
        method: "get",
    });
};
/**
 * 新增修改通知账号
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addNotifyAccount = async (param: any):PromiseRes => {
    return await request({
        url: "/api/openim/notificationAccount/save",
        method: "post",
        data: param,
    });
};
/**
 * 删除通知账号
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delNotifyAccount = async (data:any):PromiseRes => {
    return await request({
        url: "/api/openim/notificationAccount/del",
        method: "post",
        data:data
    });
};
/**
 * 上传
 *
 * @param {string} data
 * @returns
 */
export const uploadPolicy = async ():PromiseRes => {
    return await request({
        url: "/api/common/upload/policy",
        method: "get",

    });
};

