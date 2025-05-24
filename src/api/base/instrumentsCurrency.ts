import request from "@/utils/request";

/**
 * 查询平台交易产品
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listData = async (query: any) => {
    return await request({
        url: "/api/base/instrumentsCurrency/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询平台交易产品详细
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getData = async (id: number) => {
    return await request({
        url: "/api/base/instrumentsCurrency/findBy?id=" + id,
        method: "get",
    });
};

/**
 * 新增修改平台交易产品
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addData = async (param: any) => {
    return await request({
        url: "/api/base/instrumentsCurrency/save",
        method: "post",
        data: param,
    });
};

/**
 * 删除平台交易产品
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delData = async (data: any) => {
    return await request({
        url: "/api/base/instrumentsCurrency/del",
        method: "post",
        data: data,
    });
};
