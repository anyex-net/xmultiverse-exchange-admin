import request from "@/utils/request";

/**
 * 查询充提记录列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listWallTransactions = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/asset/walletAssetTransactions/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询充提记录详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getWallTransactions = async (id: number):PromiseRes<parameterForm> => {
    return await request({
        url: "/api/asset/walletAssetTransactions/findBy?id=" + id,
        method: "get",
    });
};
