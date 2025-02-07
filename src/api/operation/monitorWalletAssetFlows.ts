import request from "@/utils/request";

/**
 * 查询账户收货地址列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listMonitorFlows = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/operation/monitorWalletAssetFlows/data",
        method: "post",
        data: query,
    });
};


