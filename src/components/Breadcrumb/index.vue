<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
                 <span v-if="item.path!=='/index' || index==levelList.length-1" class="no-redirect">{{ changeName(item.meta.title) }}</span>
<!--                <a @click.prevent="handleLink(item)"-->
<!--                   v-if="item.path !== '/index' && item.meta.title == '首页' && item.name !== 'index'">{{-->
<!--                        generateTitle(item)-->
<!--                    }}</a>-->
                <!--  generateTitle(item.name) -->
<!--                <span v-if="item.redirect === 'noRedirect' || index == levelList.length - 1" class="no-redirect"-->
<!--                      @click.prevent="handleLink(item)">{{ generateTitle(item) }}1</span>-->
                <a v-else @click.prevent="handleLink(item)">{{ generateTitle(item) }}</a>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { RouteLocationNormalizedLoaded } from "vue-router";
import { generateTitle,changeName } from "@/utils/auth";
const levelList = ref<any>([]);
const { currentRoute }  = useRouter();
const router=useRouter()

watch(() => currentRoute.value, (route: RouteLocationNormalizedLoaded) => {
    if (route.path.startsWith("/redirect/")) {
        return;
    }
    getBreadcrumb();

});

const getBreadcrumb = () => {
    let matched = currentRoute.value.matched.filter((item) => item.meta && item.meta.title);
    const first = matched[0];
    if (!isDashboard(first)) {
        matched = [{ path: "/index", meta: { title: "首页" } } as any].concat(matched);
    }
    levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false);
};

const isDashboard = (route: any) => {
    const name = route && route.name;
    if (!name) {
        return false;
    }
    return name.trim() === "index";
};
onMounted(() => {
    getBreadcrumb();

});
const handleLink = (item: any) => {
    const { redirect, path } = item;
    if (redirect) {
        router.push(redirect);
        return;
    }
    router.push(path)
};

</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 8px;

    .no-redirect {
        color: #97a8be;
        cursor: text;
    }

}
</style>
