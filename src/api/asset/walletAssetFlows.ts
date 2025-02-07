import request from "@/utils/request";

/**
 * 查询账户收货地址列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listWallFlows = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/asset/walletAssetFlows/data",
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
export const getWallFlows = async (id: number):PromiseRes<parameterForm> => {
    return await request({
        url: "/api/asset/walletAssetFlows/findBy?id=" + id,
        method: "get",
    });
};
