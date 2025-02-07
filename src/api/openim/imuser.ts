import request from "@/utils/request";

/**
 * 查询用户分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listImuser = async (query: any): PromiseRes<infoData> => {
  return await request({
    url: "/api/openim/imuser/list",
    method: "post",
    data: query,
  });
};

/**
 * 查询用户详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getImuser = async (id: number): PromiseRes<any> => {
  return await request({
    url: "/api/openim/notificationAccount/findBy?id=" + id,
    method: "get",
  });
};
/**
 * 新增修改用户
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addImuser = async (param: any): PromiseRes => {
  return await request({
    url: "/api/openim/notificationAccount/save",
    method: "post",
    data: param,
  });
};
/**
 * 强制下线
 */
export const logoutUser = async (param: any) => {
  return await request({
    url: "/api/openim/imuser/forceLogout",
    method: "post",
    data: param,
  });
};
/**
 * 用户关系
 */
export const userFriend = async (param: any) => {
  return await request({
    url: "/api/openim/imuser/relationship",
    method: "post",
    data: param,
  });
};

/**
 * 删除用户好友
 */
export const deluserFriend = async (data: any) => {
  return await request({
    url: "/api/openim/imuser/deleteFriend",
    method: "post",
    data: data,
  });
};
/**
 * 上传
 *
 * @param {string} data
 * @returns
 */
export const uploadPolicy = async (): PromiseRes => {
  return await request({
    url: "/api/common/upload/policy",
    method: "get",
  });
};
