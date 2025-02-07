import request from "@/utils/request";

/**
 * 查询消息记录列表
 *
 * @param {object} query 短信日志Obj
 * @returns
 */
export const listMsgRecord = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/common/msgRecord/data",
        method: "post",
        data: query,
    });
};



/**
 * 删除消息记录配置
 *
 * @param {string} data 登录日志ID
 * @returns
 */
export const delMsgRecord = async (data:any):PromiseRes => {
    return await request({
        url: "/api/common/msgRecord/del",
        method: "post",
        data:data
    });
};

