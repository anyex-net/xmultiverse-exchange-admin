import { defineStore } from "pinia";
import auth from "@/plugins/auth";
import router, { constantRoutes, dynamicRoutes } from "@/router";
import { getRouters } from "@/api/system/resource";
import Layout from "@/layout/index.vue";
import ParentView from "@/components/ParentView/index.vue";
import InnerLink from "@/layout/components/InnerLink/index.vue";


// 匹配views里面所有的.vue文件
const modules = import.meta.glob("./../../views/**/*.vue");

const usePermissionStore = defineStore("permission", {
    state: () => ({
        routes: [] as any,
        addRoutes: [] as any,
        defaultRoutes: [] as any,
        topbarRouters: [] as any,
        sidebarRouters: [] as any,
    }),
    actions: {
        setRoutes(routes: any) {
            this.addRoutes = routes;
            this.routes = constantRoutes.concat(routes);

        },
        setDefaultRoutes(routes: any) {
            this.defaultRoutes = constantRoutes.concat(routes);
        },
        setTopbarRoutes(routes: any) {
            this.topbarRouters = routes;

        },
        setSidebarRouters(routes: any) {
            this.sidebarRouters = routes;
        },
        generateRoutes(roles?: string[]) {
            return new Promise((resolve: any) => {
                // 向后端请求路由数据
                getRouters().then((res: any) => {
                    if (res.code === 200) {
                        const data = res.data;
                        traverseNestedArray(data);
                        const sdata = JSON.parse(JSON.stringify(data));
                        const rdata = JSON.parse(JSON.stringify(data));

                        const defaultData = JSON.parse(JSON.stringify(data));
                        const sidebarRoutes = filterAsyncRouter(sdata);
                        const rewriteRoutes = filterAsyncRouter(rdata, false, true);
                        const defaultRoutes = filterAsyncRouter(defaultData);
                        this.setRoutes(rewriteRoutes);


                        this.setSidebarRouters(
                            constantRoutes.concat(sidebarRoutes),
                        );

                        this.setDefaultRoutes(sidebarRoutes);
                        this.setTopbarRoutes(defaultRoutes);

                        resolve(rewriteRoutes);

                    }
                });
            });
        },
    },
});

function traverseNestedArray(items: any[]) {
    items.forEach(item => {
        // 处理当前层级的item

        item.meta = {
            title: item.title,
        };
        // 递归遍历子项
        if (item.children) {
            traverseNestedArray(item.children);
        }
    });
}

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap: any[], lastRouter = false, type = false) {
    return asyncRouterMap.filter((route) => {

        if (type && route.children) {
            route.children = filterChildren(route.children);
        }


        if (route.component) {
            if (route.attributes === "Layout") {
                route.component = Layout;

            }
            else {
                route.component = loadView(route.component);
            }
        }
        if (route.children != null && route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children, route, type);
        } else {
            delete route["children"];
            delete route["redirect"];
        }
        return true;
    });
}

function filterChildren(childrenMap: any[], lastRouter?: any) {
    var children: any[] = [];

    childrenMap.forEach((el, index) => {
        if (el.children && el.children.length) {
            if (el.component == "ParentView" && !lastRouter) {
                el.children.forEach((c: any) => {
                    c.path = el.path + "/" + c.path;
                    if (c.children && c.children.length) {
                        children = children.concat(
                            filterChildren(c.children, c),
                        );
                        return;
                    }

                    children.push(c);
                });
                return;
            }
        }

        if (lastRouter) {
            el.path = lastRouter.path + "/" + el.path;
        }
        children = children.concat(el);
    });
    return children;
}

function getLastTwoElements(input: string): [string, string] {
    const parts = input.split("/"); // 使用指定的分隔符分割字符串
    const lastIndex = parts.length - 2; // 倒数第二个元素的索引
    // 检查是否至少有两个元素可以返回
    if (lastIndex >= 0) {
        // return [parts[lastIndex], parts[lastIndex + 1]];
        return "/" + parts[lastIndex] + "/" + parts[lastIndex + 1];
    } else {
        // 如果字符串只有一个部分，则返回空数组或者其他默认值
        return [] as [string, string];
    }
}

export const loadView = (view: any) => {

    let res;
    for (const path in modules) {
        const dir = path.split("views")[1].split("/index.vue")[0];
        const lastTwoParts = getLastTwoElements(dir);
        if (dir === view) {
            res = () => modules[path]();
        }
    }
    return res;
};

export default usePermissionStore;
