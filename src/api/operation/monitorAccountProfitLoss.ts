import request from "@/utils/request";

/**
 * 查询
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAccountProfitLoss = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/operation/monitorAccountProfitLoss/data",
        method: "post",
        data: query,
    });
};

export const statisticsAccountProfitLoss = async ():PromiseRes<infoData> => {
    return await request({
        url: "/api/operation/monitorAccountProfitLoss/statistics",
        method: "post"
    });
};


