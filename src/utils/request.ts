import axios, { AxiosResponse } from "axios";
import useUserStore from "@/store/modules/user";
import { ElNotification, ElMessageBox, ElLoading, ElMessage } from "element-plus";
import { getToken, removeToken } from "@/utils/auth";
import { tansParams, blobValidate } from "@/utils/dateTime";
import errorCode from "@/utils/errorCode";
import cache from "@/plugins/cache";
import saveAs from "file-saver";
import router from "@/router";

const userAgent = navigator.userAgent;
var isIE11 = userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
var isLessIE11 = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
import Qs from "qs";

axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=utf-8";
//创建axios实例
export const service = axios.create({
    //axios中请求配置有baseUrl选项,表示请求url公共部分
    baseURL: import.meta.env.VITE_APP_BASE_API,
    //超时
    timeout: 10000 * 20,
});

// 是否显示重新登录
export let isRelogin = { show: false };
//request拦截器
service.interceptors.request.use((config: any) => {

        // 是否需要设置 token

        // const isToken = (config.headers || {}).isToken === false;
        //    是否需要防止数据重复提交
        const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
        const token = getToken();
        token && (config.headers.Bid = token);
        if (config.method === "get" && config.params) {
            let url = config.url + "?" + tansParams(config.params);
            url = url.slice(0, -1);
            config.params = {};
            config.url = url;
        }
        if (!isRepeatSubmit && (config.method === "post" || config.method === "put")) {
            const requestObj = {
                url: config.url,
                // data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
                data: typeof config.data === "object" ? Qs.stringify(config.data) : config.data,
                time: new Date().getTime(),
            };
            const sessionObj = cache.session.getJSON("sessionObj");
            if (sessionObj === undefined || sessionObj === null || sessionObj === "") {
                cache.session.setJSON("sessionObj", requestObj);
            } else {
                const s_url = sessionObj.url; //请求地址
                const s_data = sessionObj.data;//请求数据
                const s_time = sessionObj.time;//请求时间
                // const interval = 500;//间隔时间(ms),小于此时间是为重复提交
                // if (s_data === requestObj.data && requestObj.time - s_time < interval && s_url === requestObj.url) {
                //     const message = "数据正在处理,请勿重复提交";
                //     return Promise.reject(new Error(message));
                // } else {
                //     cache.session.setJSON("sessionObj", requestObj);
                // }
            }
        }
        return config;
    }, (error) => {
        Promise.reject(error);
    },
);

service.interceptors.response.use((res: AxiosResponse) => {
        // 未设置状态码则默认成功状态
        const code = res.data.code || 200;
        // 获取错误信息
        // prettier-ignore
        // errorCode[code] ||
        const errorCodes: any = errorCode;
        const msg = errorCodes[code] || res.data.message || errorCode["default"];
        // 二进制数据则直接返回
        // prettier-ignore
        if (res.request.responseType === "blob" || res.request.responseType === "arraybuffer") {
            return res.data;
        }
        if (code === 200) {
            return res.data;
        } else if (code === 2000) {
            useUserStore().FedLogOut().then(() => {
                // location.href = "/index";
                router.push("/login");
            });
            return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
        } else if (code === 500) {
            ElMessage({
                message: msg,
                type: "error",
            });
            return Promise.reject(new Error(msg));
        } else {
            ElMessage({
                message: msg,
                type: "error",
            });
            return Promise.reject(new Error(msg));
        }
    },
    error => {
        // console.log("err", error);
        let { message } = error;
        if (message == "Network Error") {
            message = "后端接口连接异常";
        } else if (message.includes("timeout")) {
            message = "系统接口请求超时";
        } else if (message.includes("Request failed with status code")) {
            message = "系统接口" + message.substr(message.length - 3) + "异常";
        }
        ElMessage({
            message: message,
            type: "error",
            duration: 5 * 1000,
        });
        return Promise.reject(error);
    },
);
export const download = async (url: string, params: any, filename: string) => {
    // prettier-ignore
    const downloadLoadingInstance = ElLoading.service({
        text: "正在下载数据，请稍候",
        spinner: "loading",
        background: "rgba(0, 0, 0, 0.7)",
    });
    let req = null;
    if (params) {
        req = service.post(url, params, {
            transformRequest: [
                (params) => {
                    return tansParams(params);
                },
            ],
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            responseType: "blob",
        });
    } else {
        req = service.get(url, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            responseType: "blob",
        });
    }
    return await req
        .then(async (resp: any) => {
            const isLogin = await blobValidate(resp);
            if (isLogin) {
                const blob = new Blob([resp]);
                // saveAs(blob, filename, {
                // 	type: "application/octet-stream;charset=utf-8"
                // });
                saveAs(blob, filename);
                //var blob2 = new Blob([resp], {type: "text/plain;charset=utf-8"});
                //saveAs(blob, resp.msg + ".xlsx");

            } else {
                const resText = resp.text();
                const rspObj = JSON.parse(resText);
                // prettier-ignore
                const errorCodes: any = errorCode;
                const errMsg = errorCodes[rspObj.code] || rspObj.msg || errorCode["default"];
                ElMessage.error(errMsg);
            }
            downloadLoadingInstance.close();
        })
        .catch((r) => {
            console.error(r);
            ElMessage.error("下载文件出现错误，请联系管理员！");
            downloadLoadingInstance.close();
        });
};
export default service;
