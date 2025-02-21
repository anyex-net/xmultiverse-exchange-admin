import request from "@/utils/request";

/**
 * 查询提现历史
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/fund/withdrawalHistory/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询提现历史详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/fund/withdrawalHistory/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改提现历史
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/fund/withdrawalHistory/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除提现历史
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/fund/withdrawalHistory/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉提现历史
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/fund/withdrawalHistory/all",
    method: "post",
    data: query,
  });
};

export const checkDatas = async (data: any) => {
  return await request({
    url: "/api/fund/withdrawalHistory/check",
    method: "post",
    data: data,
  });
};
