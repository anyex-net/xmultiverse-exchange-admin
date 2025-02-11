<template>
    <div ref="menuRef">
        <el-menu :default-active="activeMenu" mode="horizontal" @select="handleSelect">
            <template v-for="(item, index) in topMenus">
                <el-menu-item :style="{ '--theme': theme }" :index="item.path" :key="index" v-if="showMore">
                    <!--                    v-if="index < visibleNumber"-->
                    <svg-icon class="icon" :icon-class="item.icon" />
                    {{ generateTitle(item) }}
                </el-menu-item>
            </template>
            <!-- 顶部菜单超出数量折叠 -->
            <!--            v-if="topMenus.length > visibleNumber"-->
            <el-sub-menu :style="{ '--theme': theme }" index="more" v-if="showMore==false">
                <template #title>{{ $t("moremenus") }}</template>
                <template v-for="(item, index) in topMenus" >
                    <!--                   -->
                    <el-menu-item :index="item.path" :key="index"  v-if="index >= visibleNumber">
                        <svg-icon class="icon" :icon-class="item.icon" />
                        {{ generateTitle(item) }}
                    </el-menu-item>
                </template>
            </el-sub-menu>

        </el-menu>
    </div>

</template>

<script lang="ts" setup>
import { ref, computed, onBeforeUnmount, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { constantRoutes } from "@/router";
import { isHttp } from "@/utils/validate";
import useAppStore from "@/store/modules/app";
import useSettingsStore from "@/store/modules/settings";
import usePermissionStore from "@/store/modules/permission";
import { generateTitle } from "@/utils/auth";
// 顶部栏初始数
const visibleNumber = ref<number>(0);
// 当前激活菜单的index
const currentIndex = ref<string>("");
// 隐藏侧边栏路由
const hideList = ["/index", "/userInfo/profile"];
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore = usePermissionStore();
const route = useRoute() as any;
const router = useRouter();
const menuRef = ref(null);
const showMore = ref(false);

// 主题颜色
const theme = computed(() => settingsStore.theme);
// 所有的路由信息
const routers = computed(() => permissionStore.topbarRouters);
// 顶部显示菜单
const topMenus = computed(() => {
    let topMenus = [] as any;
    routers.value.map((menu: any) => {
        if (menu.hidden !== true) {
            // 兼容顶部栏一级菜单内部跳转
            if (menu.path === "/") {
                topMenus.push(menu.children[0]);
            } else {
                topMenus.push(menu);
            }
        }
    });
    return topMenus;
});
// 设置子路由
const childrenMenus = computed(() => {
    let childrenMenus = [] as any;
    routers.value.map((router: any) => {
        for (let item in router.children) {
            if (router.children[item].parentPath === undefined) {
                if (router.path === "/") {
                    router.children[item].path = router.path + "/" + router.children[item].path;
                } else {
                    if (!isHttp(router.children[item].path)) {
                        router.children[item].path = router.path + "/" + router.children[item].path;
                    }
                }
                router.children[item].parentPath = router.path;
            }
            childrenMenus.push(router.children[item]);
        }

    });
    return constantRoutes.concat(childrenMenus);
});
// 默认激活的菜单
const activeMenu = computed(() => {
    const path = route.path;
    let activePath = path;
    if (path !== undefined && path.lastIndexOf("/") > 0 && hideList.indexOf(path) === -1) {
        const tmpPath = path.substring(1, path.length);
        activePath = "/" + tmpPath.substring(0, tmpPath.indexOf("/"));
        appStore.toggleSideBarHide(false);
    } else if (!route.children) {
        activePath = path;
        appStore.toggleSideBarHide(true);
    }
    activeRoutes(activePath);
    return activePath;
});

function setVisibleNumber() {
    const width = document.body.getBoundingClientRect().width / 3;
    const widths = width / 85;
    var element = menuRef.value as any;
    showMore.value = element.scrollWidth >= element.clientWidth;
    visibleNumber.value = parseInt(widths.toString());
    // console.log('showMore',showMore.value)
    // console.log('scrollWidth', element.scrollWidth)
    // console.log('clientWidth',element.clientWidth)
}

function handleSelect(key: string, keyPath: string[]) {
    currentIndex.value = key;
    const route = routers.value.find((item: any) => item.path === key);
    if (isHttp(key)) {
        // http(s):// 路径新窗口打开
        window.open(key, "_blank");
    } else if (!route || !route.children) {
        // 没有子路由路径内部打开
        router.push({ path: key });
        appStore.toggleSideBarHide(true);
    } else {
        // 显示左侧联动菜单
        activeRoutes(key);
        appStore.toggleSideBarHide(false);
    }
}

function activeRoutes(key: string) {
    let routes = [] as any;
    if (childrenMenus.value && childrenMenus.value.length > 0) {
        childrenMenus.value.map((item: any) => {
            if (key == item.parentPath || (key == "/index" && "" == item.path)) {
                routes.push(item);
            }
        });
    }
    if (routes.length > 0) {
        permissionStore.setSidebarRouters(routes);
    }
    return routes;
}

onMounted(() => {
    window.addEventListener("resize", setVisibleNumber);
});
onBeforeUnmount(() => {
    window.removeEventListener("resize", setVisibleNumber);
});
onMounted(() => {
    setVisibleNumber();
});

</script>

<style lang="scss">
.topmenu-container.el-menu--horizontal > .el-menu-item {
    float: left;
    height: 50px !important;
    line-height: 50px !important;
    color: #999093 !important;
    padding: 0 5px !important;
    margin: 0 10px !important;
}

.topmenu-container.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-sub-menu.is-active .el-submenu__title {
    border-bottom: 2px solid #{"var(--theme)"} !important;
    color: #303133;
}

.icon {
    margin-right: 5px;
}

/* sub-menu item */
.topmenu-container.el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
    float: left;
    height: 50px !important;
    line-height: 50px !important;
    color: #999093 !important;
    padding: 0 5px !important;
    margin: 0 10px !important;
}
</style>
