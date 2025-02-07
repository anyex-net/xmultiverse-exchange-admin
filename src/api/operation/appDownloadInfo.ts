import request from "@/utils/request";

/**
 * 查询激活信息列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDwArr = async (query: any): PromiseRes<infoData> => {
  return await request({
    url: "/api/operation/appDownloadInfo/data",
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
export const delDwArr = async (data: any): PromiseRes => {
  return await request({
    url: "/api/operation/appDownloadInfo/del",
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
export const getDwArr = async (id: number): PromiseRes<parameterForm> => {
  return await request({
    url: "/api/operation/appDownloadInfo/findBy?id=" + id,
    method: "get",
  });
};
