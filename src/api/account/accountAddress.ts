import request from "@/utils/request";

/**
 * 查询账户收货地址列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAddressArr = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/account/accountAddress/data",
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
export const getAddressArr = async (id: number):PromiseRes<parameterForm> => {
    return await request({
        url: "/api/account/accountAddress/findBy?id=" + id,
        method: "get",
    });
};
