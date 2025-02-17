import request from "@/utils/request";

/**
 * 查询RWA机构SPV产品赎回记录
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaInstSpvProductRedemption/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询RWA机构SPV产品赎回记录详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/rwa/rwaInstSpvProductRedemption/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改RWA机构SPV产品赎回记录
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/rwa/rwaInstSpvProductRedemption/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除RWA机构SPV产品赎回记录
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/rwa/rwaInstSpvProductRedemption/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉RWA机构SPV产品赎回记录
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaInstSpvProductRedemption/all",
    method: "post",
    data: query,
  });
};
