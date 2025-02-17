import request from "@/utils/request";

/**
 * 查询充值地址
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/fund/depositAddress/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询充值地址详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/fund/depositAddress/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改充值地址
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/fund/depositAddress/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除充值地址
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/fund/depositAddress/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉充值地址
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/fund/depositAddress/all",
    method: "post",
    data: query,
  });
};
