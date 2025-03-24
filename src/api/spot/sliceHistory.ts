import request from "@/utils/request";

export const listHistory = async (query: any) => {
    return await request({
        url: "/api/spot/sliceHistory/data",
        method: "post",
        data: query,
    });
};