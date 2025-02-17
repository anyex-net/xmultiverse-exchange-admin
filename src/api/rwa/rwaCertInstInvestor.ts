import request from "@/utils/request";

/**
 * 查询RWA认证机构投资者
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaCertInstInvestor/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询RWA认证机构投资者详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/rwa/rwaCertInstInvestor/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改RWA认证机构投资者
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/rwa/rwaCertInstInvestor/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除RWA认证机构投资者
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/rwa/rwaCertInstInvestor/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉RWA认证机构投资者
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaCertInstInvestor/all",
    method: "post",
    data: query,
  });
};
