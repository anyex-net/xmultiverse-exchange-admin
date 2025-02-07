import request from "@/utils/request";

/**
 * 查询APP设备列表
 *
 * @param {object} query APP设备Obj
 * @returns
 */
export const listAppDevice = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/common/appDevice/data",
        method: "post",
        data: query,
    });
};



/**
 * 删除APP设备
 *
 * @param {string} data APP设备ID
 * @returns
 */
export const delAppDevice= async (data:any):PromiseRes => {
    return await request({
        url: "/api/common/appDevice/del",
        method: "post",
        data:data
    });
};

