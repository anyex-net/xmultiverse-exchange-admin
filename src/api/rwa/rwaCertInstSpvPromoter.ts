import request from "@/utils/request";

/**
 * 查询RWA认证机构SPV发起人
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaCertInstSpvPromoter/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询RWA认证机构SPV发起人详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/rwa/rwaCertInstSpvPromoter/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改RWA认证机构SPV发起人
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/rwa/rwaCertInstSpvPromoter/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除RWA认证机构SPV发起人
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/rwa/rwaCertInstSpvPromoter/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉RWA认证机构SPV发起人
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaCertInstSpvPromoter/all",
    method: "post",
    data: query,
  });
};

export const checkDatas = async (data: any) => {
  return await request({
    url: "/api/rwa/rwaCertInstSpvPromoter/check",
    method: "post",
    data: data,
  });
};
