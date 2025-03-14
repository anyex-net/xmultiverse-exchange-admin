import request from "@/utils/request";

/**
 * 查询balance_history_example
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listBalanceHistoryExample = async (query: any) => {
    return await request({
        url: "/api/spot/balanceHistory/data",
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

/**
 * 新增修改balance_history_example
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addBalanceHistoryExample = async (param: any) => {
    return await request({
        url: "/api/spot/balanceHistory/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除balance_history_example
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delBalanceHistoryExample = async (data:any) => {
    return await request({
        url: "/api/spot/balanceHistory/del",
        method: "post",
        data:data
    });
};

/**
 * 所有下拉balance_history_example
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allBalanceHistoryExample = async (query: any) => {
    return await request({
        url: "/api/spot/balanceHistory/all",
        method: "post",
        data: query,
    });
};

