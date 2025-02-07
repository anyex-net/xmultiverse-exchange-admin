import request from "@/utils/request";

/**
 * 查询游戏信息分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listGame = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/game/game/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询游戏信息详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getGame= async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/game/game/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改游戏信息
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addGame = async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/game/game/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除游戏信息
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delGame = async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/game/game/del",
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

