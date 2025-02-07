import request from "@/utils/request";

/**
 * 查询群组分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listGroup = async (query: any): PromiseRes<infoData> => {
  return await request({
    url: "/api/openim/group/list",
    method: "post",
    data: query,
  });
};
/**
 * 查询群成员列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listGroupMembers = async (query: any): PromiseRes<infoData> => {
  return await request({
    url: "/api/openim/group/members",
    method: "post",
    data: query,
  });
};

/**
 * 查询群详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getGroup = async (id: number): PromiseRes<any> => {
  return await request({
    url: "/api/openim/group/info?groupID=" + id,
    method: "get",
  });
};
/**
 * 新增修改群
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addGroup = async (param: any): PromiseRes => {
  return await request({
    url: "/api/openim/group/add",
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: param,
  });
};
/**
 * 群成员禁言/解除成员禁言
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const memberForbidden = async (param: any): PromiseRes => {
  return await request({
    url: "/api/openim/group/forbidden/member",
    method: "post",
    data: param,
  });
};
/**
 * 删除群成员
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const delGroupMember = async (param: any): PromiseRes => {
  return await request({
    url: "/api/openim/group/del/member",
    method: "post",
    data: param,
  });
};
/**
 * 群聊设置
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const updateGroup = async (param: any): PromiseRes => {
  return await request({
    url: "/api/openim/group/update",
    method: "post",
    headers: { "Content-Type": "application/json" },
    data: param,
  });
};
/**
 *添加群成员
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addGroupmember = async (param: any): PromiseRes => {
  return await request({
    url: "/api/openim/group/add/member",
    method: "post",

    data: param,
  });
};

/**
 * 解散群
 */
export const delGroup = async (data: any) => {
  return await request({
    url: "/api/openim/group/del",
    method: "post",
    data: data,
  });
};
/**
 * 设置成员身份
 */
export const groupSetRole = async (data: any): PromiseRes => {
  return await request({
    url: "/api/openim/group/setRole",
    method: "post",
    data: data,
  });
};
/**
 * 全体禁言
 */
export const allForbidden = async (data: any) => {
  return await request({
    url: "/api/openim/group/forbidden",
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
