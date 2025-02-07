import request from "@/utils/request";

/**
 * 查询打赏礼物记录分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listgiftList = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/asset/walletAssetTipGift/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询打赏礼物记录详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getgiftList = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/asset/walletAssetTipGift/findBy?id=" + id,
        method: "get",
    });
};
/**
 * 新增修改打赏礼物记录
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addgiftList = async (param: any):PromiseRes => {
    return await request({
        url: "/api/asset/walletAssetTipGift/save",
        method: "post",
        data: param,
    });
};
/**
 * 删除打赏礼物记录
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delgiftList = async (data:any):PromiseRes => {
    return await request({
        url: "/api/asset/walletAssetTipGift/del",
        method: "post",
        data:data
    });
};
/**
 * 上传
 *
 * @param {string} data
 * @returns
 */
export const uploadPolicy = async ():PromiseRes => {
    return await request({
        url: "/api/common/upload/policy",
        method: "get",

    });
};

