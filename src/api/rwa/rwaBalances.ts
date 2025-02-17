import request from "@/utils/request";

/**
 * 查询RWA账户余额
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaBalances/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询RWA账户余额详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/rwa/rwaBalances/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改RWA账户余额
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/rwa/rwaBalances/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除RWA账户余额
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/rwa/rwaBalances/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉RWA账户余额
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaBalances/all",
    method: "post",
    data: query,
  });
};
