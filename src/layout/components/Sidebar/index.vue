<template>
    <div  :class="{ 'has-logo': showLogo }"
    :style="{
        backgroundColor: sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground
    }">
    <Logo v-if="showLogo" :collapse="isCollapse"/>

    <el-scrollbar :class="sideTheme" wrap-class="scrollbar-wrapper">
        <el-menu
        router
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground"
        :text-color="sideTheme === 'theme-dark' ? variables.menuColor : variables.menuLightColor"
        :unique-opened="true"
        :active-text-color="theme"
        :collapse-transition="false"
        mode="vertical"
      >
         <sidebar-item
          v-for="(route,index) in sidebarRouters"
          :key="route.path+index"
          :item="route"
          :base-path="route.path"
          />
      </el-menu>
    </el-scrollbar>

    </div>
</template>

<script lang='ts' setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router';
import Logo from "./Logo.vue"
import SidebarItem from './SidebarItem.vue'
import useAppStore from '@/store/modules/app';
import useSettingsStore from '@/store/modules/settings';
import variables from "@/assets/styles/variables.module.scss";
import usePermissionStore from "@/store/modules/permission";
const route = useRoute();
const appStore = useAppStore();
const settingsStore = useSettingsStore();
const permissionStore=usePermissionStore();
const sidebarRouters=computed(()=>permissionStore.sidebarRouters);
const showLogo = computed(() => settingsStore.sidebarLogo);
const sideTheme = computed(() => settingsStore.sideTheme );
const theme = computed(() => settingsStore.theme);
const isCollapse = computed(() => !appStore.sidebar.opened);
const activeMenu = computed(() => {
    const { meta, path } = route;
    if (meta.activeMenu) {
        return meta.activeMenu;
    }
    return path;
}) as any;
</script>

<style lang="scss" scoped>

</style>
