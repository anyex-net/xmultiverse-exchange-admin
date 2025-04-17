import request from "@/utils/request";

/**
 *
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listData = async (query: any) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductAsset/data",
        method: "post",
        data: query,
    });
};

/**
 *
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getData = async (id: number) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductAsset/findBy?id=" + id,
        method: "get",
    });
};

/**
 *
 *
 * @param {object} param 参数Obj
 * @returns
 */
export const addDatas = async (param: any) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductAsset/save",
        method: "post",
        data: param,
    });
};

/**
 *
 * @param {string} data 参数ID
 * @returns
 */
export const delDatas = async (data: any) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductAsset/del",
        method: "post",
        data: data,
    });
};

export const checkData = async (data: any) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductAsset/check",
        method: "post",
        data: data,
    });
};
