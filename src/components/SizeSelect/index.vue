<template>
    <el-dropdown trigger="click" @command="handleSetSize">
        <div>
            <svg-icon class-name="size-icon" icon-class="size" />
        </div>
        <template #dropdown>
        <el-dropdown-menu >
            <el-dropdown-item v-for="item in sizeOptions" :key="item.value" :disabled="size === item.value"
                :command="item.value">{{ item.label }}</el-dropdown-item>
        </el-dropdown-menu>
    </template>
    </el-dropdown>
</template>

<script lang='ts' setup>
import useAppStore from "@/store/modules/app"
import { ref, reactive, toRefs, computed, nextTick } from 'vue'
import { useRoute, useRouter } from "vue-router"
import useTagsViewStore from "@/store/modules/tagsView";
import { ElMessage } from 'element-plus'
const appStore = useAppStore();
const tagsViewStore = useTagsViewStore();
const route = useRoute();
const router = useRouter();
const size = computed(() => appStore.size)
const state = reactive<{sizeOptions:{label:string;value:string}[]}>({
    sizeOptions: [
        { label: 'Default', value: 'default' },
        { label: 'Medium', value: 'medium' },
        { label: 'Small', value: 'small' },
        { label: 'Mini', value: 'mini' }
    ]
})
const { sizeOptions } = toRefs(state)
const handleSetSize = (size: string) => {
    appStore.setSize(size)
    refseshView();
    ElMessage({
        message: 'Switch Size Success',
        type: 'success',
    })
    // $ELEMENT.size = size
}
const refseshView = () => {
    tagsViewStore.delAllCachedViews(route);
    const { fullPath } = route;
    nextTick(() => {
        router.replace({
            path: '/redirect' + fullPath
        })
    })
} 
</script>
