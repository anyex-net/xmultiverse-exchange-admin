import request from "@/utils/request";

/**
 * 查询区域代码列表
 *
 * @param {object} query 区域代码Obj
 * @returns
 */
export const listRegion = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/common/region/data",
        method: "post",
        data: query,
    });
};



/**
 * 删除区域代码
 *
 * @param {string} data 区域代码ID
 * @returns
 */
export const delRegion = async (data:any):PromiseRes => {
    return await request({
        url: "/api/common/region/del",
        method: "post",
        data:data
    });
};

