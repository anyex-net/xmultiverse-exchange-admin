import request from "@/utils/request";

/**
 * 查询资金账户余额
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/fund/balances/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询资金账户余额详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/fund/balances/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改资金账户余额
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/fund/balances/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除资金账户余额
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/fund/balances/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉资金账户余额
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/fund/balances/all",
    method: "post",
    data: query,
  });
};
