import request from "@/utils/request";

/**
 * 查询账户列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listWalletArr = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/asset/walletAsset/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询账户详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getWalletArr = async (id: number):PromiseRes<parameterForm> => {
    return await request({
        url: "/api/asset/walletAsset/findBy?id=" + id,
        method: "get",
    });
};

export const adjustWalletArr = async (query: any):PromiseRes => {
    return await request({
        url: "/api/asset/walletAsset/adjust",
        method: "post",
        data: query,
    });
};
