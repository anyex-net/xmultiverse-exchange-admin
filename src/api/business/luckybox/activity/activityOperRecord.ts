import request from "@/utils/request";

/**
 * 查询账户收货地址列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAcRecords = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/business/luckybox/activity/activityOperRecord/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询账户收货地址详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getAcRecords = async (id: number):PromiseRes<parameterForm> => {
    return await request({
        url: "/api/business/luckybox/activity/activityOperRecord/findBy?id=" + id,
        method: "get",
    });
};
