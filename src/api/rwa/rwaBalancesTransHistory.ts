import request from "@/utils/request";

/**
 * 查询RWA账户交易历史
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaBalancesTransHistory/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询RWA账户交易历史详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/rwa/rwaBalancesTransHistory/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改RWA账户交易历史
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/rwa/rwaBalancesTransHistory/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除RWA账户交易历史
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/rwa/rwaBalancesTransHistory/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉RWA账户交易历史
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaBalancesTransHistory/all",
    method: "post",
    data: query,
  });
};
