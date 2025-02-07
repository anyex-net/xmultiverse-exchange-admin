import request from "@/utils/request";

/**
 * 查询
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listWalletAdjustArr = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/asset/walletAssetAdjust/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getWalletAdjustArr = async (id: number):PromiseRes<parameterForm> => {
    return await request({
        url: "/api/asset/walletAssetAdjust/findBy?id=" + id,
        method: "get",
    });
};

export const adjustWalletArr = async (query: any):PromiseRes => {
    return await request({
        url: "/api/asset/walletAssetAdjust/adjust",
        method: "post",
        data: query,
    });
};
/**
* 上传
*/
export const uploadPolicy1 = async (): PromiseRes => {
 return await request({
   url: "/api/common/upload/policy",
   method: "get",
 });
};


