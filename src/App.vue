<template>
    <suspense>
        <router-view></router-view>
    </suspense>
</template>
<script setup lang="ts">
import useSettingsStore from "@/store/modules/settings";
import { handleThemeStyle } from "@/utils/theme";
import { onMounted, nextTick } from "vue";

onMounted(() => {
    nextTick(() => {
        //    初始化主题样式
        handleThemeStyle(useSettingsStore().theme);
    });
});
</script>
