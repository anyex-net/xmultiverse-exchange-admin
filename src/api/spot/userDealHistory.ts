import request from "@/utils/request";

/**
 * 查询balance_history_example
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listHistory = async (query: any) => {
    return await request({
        url: "/api/spot/userDealHistory/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询balance_history_example详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getBalanceHistoryExample = async (id: number) => {
    return await request({
        url: "/api/spot/balanceHistory/findBy?id=" + id,
        method: "get",
    });
};
