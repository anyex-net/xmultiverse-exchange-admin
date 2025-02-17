import request from "@/utils/request";

/**
 * 查询平台币种
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listCurrencies = async (query: any) => {
  return await request({
    url: "/api/base/currencies/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询平台币种详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getCurrencies = async (id: number) => {
  return await request({
    url: "/api/base/currencies/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改平台币种
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addCurrencies = async (param: any) => {
  return await request({
    url: "/api/base/currencies/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除平台币种
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delCurrencies = async (data: any) => {
  return await request({
    url: "/api/base/currencies/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉平台币种
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allCurrencies = async (query: any) => {
  return await request({
    url: "/api/base/currencies/all",
    method: "post",
    data: query,
  });
};
