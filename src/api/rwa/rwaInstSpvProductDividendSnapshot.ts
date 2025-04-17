import request from "@/utils/request";

/**
 *
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listData = async (query: any) => {
    return await request({
        url: "/api/rwa/rwaInstSpvProductDividendSnapshot/data",
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
        url: "/api/rwa/rwaInstSpvProductDividendSnapshot/findBy?id=" + id,
        method: "get",
    });
};

