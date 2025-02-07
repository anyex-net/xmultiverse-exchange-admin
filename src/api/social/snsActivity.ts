
import request from "@/utils/request";

/**
 * 查询社交活动
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listSnsActivity = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/social/snsactivity/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询社交活动详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getSnsActivity = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/social/snsactivity/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改社交活动
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const saveSnsActivity = async (param: any):PromiseRes => {
    return await request({
        url: "/api/social/snsactivity/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除社交活动
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delSnsActivity = async (data:any):PromiseRes=> {
    return await request({
        url: "/api/social/snsactivity/del",
        method: "post",
        data:data
    });
};

/**
 * 所有下拉社交活动
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allSnsActivity = async (query: any) => {
    return await request({
        url: "/api/social/snsactivity/all",
        method: "post",
        data: query,
    });
};

