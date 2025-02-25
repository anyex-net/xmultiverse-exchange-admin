import request from "@/utils/request";

/**
 * 现货资产总览
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
    return await request({
        url: "/api/spot/spotAssetSummary/data",
        method: "post",
        data: query,
    });
};