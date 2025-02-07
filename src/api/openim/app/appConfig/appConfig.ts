import request from "@/utils/request";

/**
 * 查询全局配置分页列表
 */

export const listconfigList = async (query: any):PromiseRes<infoData> => {
    return await request({
        url: "/api/openim/client_config/get",
        method: "post",
        data: query,
    });
};

/**
 * 上传
 */
export const uploadPolicy = async ():PromiseRes => {
    return await request({
        url: "/api/common/upload/policy",
        method: "get",

    });
};

