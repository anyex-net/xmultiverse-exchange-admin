import request from "@/utils/request";

/**
 * 查询消息模板列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listMsgTemplate = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/common/msgTemplate/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询消息模板详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getMsgTemplate = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/common/msgTemplate/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改消息模板
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addMsgTemplate = async (param: any):PromiseRes => {
    return await request({
        url: "/api/common/msgTemplate/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除消息模板
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delMsgTemplate = async (data:any):PromiseRes => {
    return await request({
        url: "/api/common/msgTemplate/del",
        method: "post",
        data:data
    });
};

