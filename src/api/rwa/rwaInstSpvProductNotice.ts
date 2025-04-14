import request from "@/utils/request";

/**
 * 查询RWA机构SPV产品公告
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listData = async (query: any) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductNotice/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询RWA机构SPV产品公告详情
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getData = async (id: number) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductNotice/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改RWA机构SPV产品公告
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addData = async (param: any) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductNotice/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除RWA机构SPV产品公告
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delData = async (data: any) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductNotice/del",
        method: "post",
        data: data,
    });
};

export const checkData = async (data: any) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductNotice/check",
        method: "post",
        data: data,
    });
};
