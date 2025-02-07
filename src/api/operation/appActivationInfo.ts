import request from "@/utils/request";

/**
 * 查询激活信息列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listActArr = async (query: any): PromiseRes<infoData> => {
  return await request({
    url: "/api/operation/appActivationInfo/data",
    method: "post",
    data: query,
  });
};
/**
 * 删除激活信息
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delActArr = async (data: any): PromiseRes => {
  return await request({
    url: "/api/operation/appActivationInfo/del",
    method: "post",
    data: data,
  });
};
/**
 * 查询激活信息详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getActArr = async (id: number): PromiseRes<parameterForm> => {
  return await request({
    url: "/api/operation/appActivationInfo/findBy?id=" + id,
    method: "get",
  });
};
