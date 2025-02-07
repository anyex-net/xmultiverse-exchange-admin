import request from "@/utils/request";

/**
 * 查询缓存列表
 *
 * @param {object} query 缓存Obj
 * @returns
 */
export const listLogLogin = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/system/cache/data",
        method: "get",
        params: query,
    });
};



/**
 * 删除缓存配置
 *
 * @param {string} data 缓存管理
 * @returns
 */
export const delLogLogin = async (data:any):PromiseRes => {
    return await request({
        url: "/api/system/cache/del",
        method: "post",
        data:data
    });
};
/**
 * 清楚所有缓存
 *
 * @param {string} data 缓存管理
 * @returns
 */
export const cacheCleanAll = async ():PromiseRes => {
    return await request({
        url: "/api/system/cache/clean/all",
        method: "post",
    });
};
/**
 * 清除mybatis缓存
 *
 * @param {string} data 缓存管理
 * @returns
 */
export const cacheCleanMybatis = async ():PromiseRes => {
    return await request({
        url: "/api/system/cache/clean/mybatis",
        method: "post",
    });
};
/**
 * 清除session缓存
 *
 * @param {string} data 缓存管理
 * @returns
 */
export const cacheCleanSession = async ():PromiseRes => {
    return await request({
        url: "/api/system/cache/clean/session",
        method: "post",
    });
};
