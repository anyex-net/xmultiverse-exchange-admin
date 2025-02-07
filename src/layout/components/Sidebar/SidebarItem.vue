<template>
    <div v-if="!item.hidden">
        <template
            v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren) && !item.alwaysShow">
            <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
                <el-menu-item  v-if="onlyOneChild.meta" :index="resolvePath(onlyOneChild.path)"
                              :class="{ 'submenu-title-noDropdown': !isNest }" @click="getRoute(item)">
                    <svg-icon v-if="onlyOneChild.icon || item.icon" :icon-class="onlyOneChild.icon || item.icon" />
                    <template #title>
            <span class="menu-title" :title="hasTitle(onlyOneChild.title)">
              <en :title="generateTitle(onlyOneChild)" ></en>
             </span>
                        <!--  {{ onlyOneChild.meta.title }}  -->
                    </template>
                </el-menu-item>
            </app-link>
        </template>
        <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
            <template v-if="item" #title>
                <svg-icon :icon-class="item.icon" />
                <!-- generateTitle(item.meta.title)  item.meta.title -->
                <span class="menu-title" :title="hasTitle(item.title)" >{{ generateTitle(item) }}</span>
            </template>
            <sidebar-item v-for="child in item.children" :key="child.path" :is-nest="true" :item="child"
                          :base-path="resolvePath(child.path)" class="nest-menu">
            </sidebar-item>
        </el-sub-menu>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { isExternal } from "@/utils/validate";
import AppLink from "./Link.vue";
import { getNormalPath } from "@/utils/dateTime";
import { generateTitle, setRoute } from "@/utils/auth";
import en from "./en.vue";

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    isNest: {
        type: Boolean,
        default: false,
    },
    basePath: {
        type: String,
        default: "",
    },
});
const onlyOneChild = ref({
    children: [],
    noShowingChildren: [],
    icon: "",
    name: "",
    meta: {
        title: "",
        icon: "",
    },
    path: "",
    query: {},
});
const showingChildren = ref([
    {
        path: "",
    },
]);
const getRoute = (item: any) => {
    setRoute(JSON.stringify(item));
};

function hasOneShowingChild(children = [], parent: any) {
    if (!children) {
        children = [];
    }
    showingChildren.value = children.filter((item: any) => {
        // if (item.hidden) {
        //   return false;
        // } else {
        onlyOneChild.value = item;
        return true;
        // }
    });
    if (showingChildren.value.length ===1 && showingChildren.value[0].path === "/index") {
        return true;
    }


    if (showingChildren.value.length === 0) {
        onlyOneChild.value = { ...parent, path: "", noShowingChildren: true };
        return true;
    }
    return false;
}

function resolvePath(routePath: any, routeQuery?: any) {
    if (isExternal(routePath)) {
        return routePath;
    }
    if (isExternal(props.basePath)) {
        return props.basePath;
    }
    if (routeQuery) {
        let query = JSON.parse(routeQuery);

        return {
            path: getNormalPath(props.basePath + "/" + routePath),
            query: query,
        };
    }
    return getNormalPath(props.basePath + "/" + routePath);

}

function hasTitle(title: string) {
    if (title.length > 5) {
        return title;
    } else {
        return "";
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-menu-item.is-active::before {
    //color: coral !important;
    //border-left: 2px solid var(--el-menu-active-color);
    // content: '';
    // position: absolute;
    // width:5px;
    // height: 20px;
    // left: 0;
    // background-color: paleturquoise ;

}
//
//::v-deep .el-menu-item{
//    padding-left:70px !important;
//}
//::v-deep .submenu-title-noDropdown{
//    padding-left:20px !important;
//}
</style>
