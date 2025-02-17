import request from "@/utils/request";

/**
 * 查询用户信息
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listDatas = async (query: any) => {
  return await request({
    url: "/api/user/user/data",
    method: "post",
    data: query,
  });
};

/**
 * 查询用户信息详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getDatas = async (id: number) => {
  return await request({
    url: "/api/user/user/findBy?id=" + id,
    method: "get",
  });
};

/**
 * 新增修改用户信息
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
  return await request({
    url: "/api/user/user/save",
    method: "post",
    data: param,
  });
};

/**
 * 删除用户信息
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
  return await request({
    url: "/api/user/user/del",
    method: "post",
    data: data,
  });
};

/**
 * 所有下拉用户信息
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const allDatas = async (query: any) => {
  return await request({
    url: "/api/user/user/all",
    method: "post",
    data: query,
  });
};
