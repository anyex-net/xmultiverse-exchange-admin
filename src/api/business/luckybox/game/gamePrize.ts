import request from "@/utils/request";

/**
 * 查询游戏奖品分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listGamePrize = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/game/gamePrize/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询游戏奖品详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getGamePrize= async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/game/gamePrize/findBy?id=" + id,
        method: "get",
    });
};
/**
 * 查询游戏信息所有数据
 *
 * @param {number} id 参数ID
 * @returns
 */
export const gameList= async ():PromiseRes<any> => {
    return await request({
        url: "/api/business/luckybox/game/game/gameList",
        method: "get",
    });
};

/**
 * 新增修改游戏奖品
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addGamePrize = async (param: any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/game/gamePrize/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除游戏奖品
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delGamePrize = async (data:any):PromiseRes => {
    return await request({
        url: "/api/business/luckybox/game/gamePrize/del",
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

