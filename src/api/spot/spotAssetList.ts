import request from "@/utils/request";

/**
 * 查询资金账户余额
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
    return await request({
        url: "/api/spot/spotAssetList/data",
        method: "post",
        data: query,
    });
};
