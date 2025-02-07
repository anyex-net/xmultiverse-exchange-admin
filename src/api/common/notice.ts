import request from "@/utils/request";

/**
 * 查询平台公告列表
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listNotice = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/common/notice/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询平台公告详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getNotice = async (id: number):PromiseRes<any> => {
    return await request({
        url: "/api/common/notice/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改平台公告
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addNotice = async (param: any):PromiseRes => {
    return await request({
        url: "/api/common/notice/save",
        method: "post",
        data: param,
    });
};
/**
 * 更新平台公告状态
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const noticeUpdateStatus = async (data: any):PromiseRes => {
    return await request({
        url: "/api/common/notice/updateStatus",
        method: "post",
        data: data,
    });
};

/**
 * 删除平台公告
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delNotice = async (data:any):PromiseRes => {
    return await request({
        url: "/api/common/notice/del",
        method: "post",
        data:data
    });
};
/**
 * 上传
 *
 * @param {string} data
 * @returns
 */
export const uploadPolicy = async ():PromiseRes => {
    return await request({
        url: "/api/common/upload/policy",
        method: "get",

    });
};

