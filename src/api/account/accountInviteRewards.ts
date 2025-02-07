import request from "@/utils/request";

/**
 * 列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listStatisticsRewardsArr = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/account/accountInviteRewards/data/rewards",
        method: "post",
        data: query,
    });
};

/**
 * 明细
 * @param query
 */
export const detailStatisticsRewardsArr = async (id: number):PromiseRes<infoData> => {
    return await request({
        url: "/api/account/accountInviteRewards/data/rewards/detail?id=" + id,
        method: "get",
    });
};

/**
 * 统计
 * @param query
 */
export const statisticsRewardsArr = async (id: number):PromiseRes<infoData> => {
    return await request({
        url: "/api/account/accountInviteRewards/data/rewards/statistics",
        method: "get",
    });
};