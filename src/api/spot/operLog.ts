import request from "@/utils/request";

export const listHistory = async (query: any) => {
    return await request({
        url: "/api/spot/operlog/data",
        method: "post",
        data: query,
    });
};
