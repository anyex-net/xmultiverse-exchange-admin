import request from "@/utils/request";

/**
 * 查询注册默认好友
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listRegisterDefaultFriend = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/openim/registerDefaultFriend/data",
        method: "post",
        data: query,
    });
};
// 用户下拉列表
export const userRegisterDefaultFriend = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/openim/registerDefaultFriend/user",
        method: "post",
        data: query,
    });
};

/**
 * 添加默认好友
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addRegisterDefaultFriend = async (param: any):PromiseRes => {
    return await request({
        url: "/api/openim/registerDefaultFriend/add",
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
export const delRegisterDefaultFriend = async (data:any):PromiseRes => {
    return await request({
        url: "/api/openim/registerDefaultFriend/del",
        method: "post",
        data:data
    });
};

