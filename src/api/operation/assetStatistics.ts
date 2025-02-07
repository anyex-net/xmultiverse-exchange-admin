import request from "@/utils/request";

/**
 * 充值统计
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDeposit = async (query: any): PromiseRes<parameterForm> => {
  return await request({
    url: "/api/statistics/deposit",
    method: "post",
    data: query,
  });
};

/**
 * 提现统计
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listWithdraw = async (query: any): PromiseRes<parameterForm> => {
  return await request({
    url: "/api/statistics/withdraw",
    method: "post",
    data: query,
  });
};

/**
 * 用户支出统计
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listFlow = async (query: any): PromiseRes<parameterForm> => {
  return await request({
    url: "/api/statistics/flow",
    method: "post",
    data: query,
  });
};

