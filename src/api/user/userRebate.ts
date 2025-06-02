import request from "@/utils/request";

/**
 * 查询用户返佣记录
 *
 * @param {object} query 参数Obj
 * @returns
 */
export const listData = async (query: any) => {
    return await request({
        url: "/api/user/userRebate/data",
        method: "post",
        data: query,
    });
};

/**
 * 查询用户返佣记录详情
 *
 * @param {number} id 参数ID
 * @returns
 */
export const getData = async (id: number) => {
    return await request({
        url: "/api/user/userRebate/findBy?id=" + id,
        method: "get",
    });
};
