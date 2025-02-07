import request from "@/utils/request";

/**
 * 查询单聊消息列表
 */
export const userMessageList = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/openim/message/single/list",
        method: "post",
        data: query,
    });
};
/**
 * 单聊消息撤回
 */
export const revokeIt = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/openim/message/single/revoke",
        method: "post",
        data: query,
    });
};

/**
 * 查询详细
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

