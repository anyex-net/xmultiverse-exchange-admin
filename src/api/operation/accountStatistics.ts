import request from "@/utils/request";

/**
 * 查询用户注册统计
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listRegister = async (query: any): PromiseRes<infoData> => {
  return await request({
    url: "/api/statistics/register",
    method: "post",
    data: query,
  });
};

/**
 * 用户装机激活
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listAppActivation = async (query: any): PromiseRes<infoData> => {
  return await request({
    url: "/api/statistics/appActivation",
    method: "post",
    data: query,
  });
};

/**
 * 用户转化率
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listSwitchRate = async (query: any): PromiseRes<infoData> => {
  return await request({
    url: "/api/statistics/accountSwitchRate",
    method: "post",
    data: query,
  });
};

