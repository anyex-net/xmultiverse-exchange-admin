import request from "@/utils/request";

/**
 * 查询账户收款银行列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listBankArr = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/account/accountReceivingBank/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询账户收款银行详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getBankArr = async (id: number):PromiseRes<parameterForm> => {
    return await request({
        url: "/api/account/accountReceivingBank/findBy?id=" + id,
        method: "get",
    });
};
