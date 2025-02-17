import request from "@/utils/request";

/**
 * 查询平台交易手续费费率
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/base/instTradeFee/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询平台交易手续费费率详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/base/instTradeFee/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改平台交易手续费费率
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/base/instTradeFee/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除平台交易手续费费率
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/base/instTradeFee/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉平台交易手续费费率
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/base/instTradeFee/all",
    method: "post",
    data: query,
  });
};
