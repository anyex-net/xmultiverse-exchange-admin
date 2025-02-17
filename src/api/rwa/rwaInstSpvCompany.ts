import request from "@/utils/request";

/**
 * 查询RWA机构SPV公司
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaInstSpvCompany/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询RWA机构SPV公司详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/rwa/rwaInstSpvCompany/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改RWA机构SPV公司
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/rwa/rwaInstSpvCompany/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除RWA机构SPV公司
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/rwa/rwaInstSpvCompany/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉RWA机构SPV公司
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/rwa/rwaInstSpvCompany/all",
    method: "post",
    data: query,
  });
};
