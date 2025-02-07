import request from "@/utils/request";
import request1 from "@/utils/request1";

/**
 * 查询用户分页列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listNotifyAccount = async (query: any): PromiseRes<infoData> => {
  return await request({
    url: "/api/openim/notificationPublish/notificationPublish/user",
    method: "post",
    data: query,
  });
};

/**
 * 查询通知账号列表
 */
export const getListNotify = async () => {
  return await request({
    url: "/api/openim/notificationPublish/list",
    method: "post",
  });
};
/**
 * 查询通知账号列表
 */
export const sendNotifyAddress = async (query: any) => {
  return await request({
    url: "/api/openim/notificationPublish/batchSendMsg",
    method: "post",
    data: query,
    headers: { "Content-Type": "application/json" },
  });
};
/**
 * 上传
 */
export const uploadPolicy = async (): PromiseRes => {
  return await request({
    url: "/api/common/upload/policy",
    method: "get",
  });
};
// 请求token
export const tokenGet = async (): PromiseRes => {
  return await request({
    url: "/api/openim/notificationPublish/batchSendMsgAuth",
    method: "get",
  });
};
// 上传前
export const uploada1 = async (data: any, token1: any): PromiseRes => {
  return await request1({
    url: "/object/part_size",
    method: "post",
    headers: {
      operationid: token1,
      Token: token1,
      "content-type": "application/json",
    },
    data,
  });
};
// 上传
export const upload1 = async (data: any, token1: any): PromiseRes => {
  return await request1({
    url: "/object/initiate_multipart_upload",
    method: "post",
    headers: {
      operationid: token1,
      Token: token1,
      "content-type": "application/json",
    },
    data,
  });
};
// 上传
export const completeMultipartUpload = async (data: any, token1: any): PromiseRes => {
  return await request1({
    url: "/object/complete_multipart_upload",
    method: "post",
    headers: {
      operationid: token1,
      Token: token1,
      "content-type": "application/json",
    },
    data,
  });
};
