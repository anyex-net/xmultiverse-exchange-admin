<template>
    <div>
        <svg-icon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="click" />
    </div>
</template>

<script lang='ts' setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import screenfull from 'screenfull'
import { ElMessage } from 'element-plus';
const isFullscreen = ref<boolean>(false);
const click = () => {

    if (!screenfull.isEnabled) {
        ElMessage({
            message: '你的浏览器不支持全屏',
            type: 'warning',
        })
        return false
    }
    screenfull.toggle()
}
const change = () => {
    isFullscreen.value = screenfull.isFullscreen
}
onMounted(() => {
    init();
})
onBeforeUnmount(() => {
    destroy()
})
const init = () => {
    if (screenfull.isEnabled) {
        screenfull.on('change', change);
    }
}
const destroy = () => {
    if (screenfull.isEnabled) {
        screenfull.off('change', change)
    }
}
</script>
 
<style lang="scss" scoped>
.screenfull-svg {
    display: inline-block;
    cursor: pointer;
    fill: #5a5e66;
    ;
    width: 20px;
    height: 20px;
    vertical-align: 10px;
}
</style>